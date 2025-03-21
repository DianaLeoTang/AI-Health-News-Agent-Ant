import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import * as d3 from 'd3';
import { saveAs } from 'file-saver';
import './index.css';

interface MarkdownMindMapProps {
  initialMarkdown?: string;
  width?: number;
  height?: number;
  minZoom?: number;
  maxZoom?: number;
}

interface MindMapNode {
  id: string;
  name: string;
  level: number;
  children: MindMapNode[];
  parent?: MindMapNode;
  x?: number;
  y?: number;
}

const MarkdownMindMap: React.FC<MarkdownMindMapProps> = ({
  initialMarkdown = '# Root Heading\n\n## Sub Heading 1\n\nContent 1\n\n### Deeper level\n\nMore content\n\n## Sub Heading 2\n\nContent 2',
  width = 800,
  height = 600,
  minZoom = 0.5,
  maxZoom = 3
}) => {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const svgRef = useRef<SVGSVGElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<string>('png');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [transform, setTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });

  // Parse markdown content into a hierarchical tree structure
  const parseMarkdownToTree = (markdownContent: string): MindMapNode => {
    const lines = markdownContent.split('\n');
    const root: MindMapNode = {
      id: 'root',
      name: 'Root',
      level: 0,
      children: [],
    };

    let currentNode = root;
    let currentLevel = 0;
    let idCounter = 0;

    lines.forEach(line => {
      // Check for headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        idCounter++;

        // Create new node
        const newNode: MindMapNode = {
          id: `node-${idCounter}`,
          name: text,
          level,
          children: [],
        };

        // Find appropriate parent
        if (level > currentLevel) {
          // This is a child of the current node
          newNode.parent = currentNode;
          currentNode.children.push(newNode);
        } else {
          // Go up the tree to find the appropriate parent
          let parent = currentNode;
          while (parent && parent.level >= level) {
            parent = parent.parent!;
          }

          if (parent) {
            parent.children.push(newNode);
            newNode.parent = parent;
          } else {
            // If no appropriate parent found, add to root
            root.children.push(newNode);
            newNode.parent = root;
          }
        }

        currentNode = newNode;
        currentLevel = level;
      } else if (line.trim() !== '') {
        // For paragraph content, we could either ignore or add as leaf nodes
        // Here we'll add non-empty, non-heading lines as leaf nodes
        idCounter++;
        const contentNode: MindMapNode = {
          id: `node-${idCounter}`,
          name: line.trim(),
          level: currentLevel + 1,
          children: [],
          parent: currentNode,
        };
        currentNode.children.push(contentNode);
      }
    });

    return root;
  };

  // Render the mind map using D3
  const renderMindMap = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setTransform({ x: event.transform.x, y: event.transform.y, k: event.transform.k });
        setZoomLevel(event.transform.k);
      });

    // Apply zoom behavior to svg
    svg.call(zoom as any);

    // Create the main group where we'll draw the mind map
    const g = svg.append('g')
      .attr('class', 'mindmap-container-g');

    // Apply stored transform if any
    if (transform.k !== 1 || transform.x !== 0 || transform.y !== 0) {
      g.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
      // Also need to update the zoom transform object for consistency
      svg.call((zoom as any).transform, d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k));
    }

    // Parse markdown to tree
    const root = parseMarkdownToTree(markdown);

    // Create hierarchical layout - make it more spacious to avoid overlaps
    const treeLayout = d3.tree<MindMapNode>()
      .size([height - 100, width / 2 - 100])
      .separation((a, b) => (a.parent === b.parent ? 1.5 : 2)); // Increased separation

    // Convert to d3 hierarchy
    const hierarchy = d3.hierarchy(root);

    // Apply layout
    const treeData = treeLayout(hierarchy);

    // Add links
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        return `M${d.source.y},${d.source.x}
                C${(d.source.y + d.target.y) / 2},${d.source.x}
                 ${(d.source.y + d.target.y) / 2},${d.target.x}
                 ${d.target.y},${d.target.x}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-width', 1.5);

    // Add nodes
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', d => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Add node circles
    nodes.append('circle')
      .attr('r', 5)
      .attr('fill', d => d.depth === 0 ? '#ff7700' : d.children ? '#555' : '#999');

    // Add node labels with background rectangle for better readability
    nodes.append('rect')
      .attr('class', 'node-label-bg')
      .attr('x', d => d.children ? -8 - getTextWidth(d.data.name) : 8)
      .attr('y', -10)
      .attr('width', d => getTextWidth(d.data.name) + 10)
      .attr('height', 20)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', 'white')
      .attr('fill-opacity', 0.8);

    // Add node labels
    nodes.append('text')
      .attr('dy', '.31em')
      .attr('x', d => d.children ? -8 : 8)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name)
      .attr('font-size', '12px')
      .attr('font-family', 'Arial, sans-serif');

    // Center the view
    const rootNode = treeData.descendants()[0];
    const centerX = rootNode.y;
    const centerY = rootNode.x;

    // Only center initially if no custom transform is already set
    if (transform.k === 1 && transform.x === 0 && transform.y === 0) {
      const initialTransform = d3.zoomIdentity
        .translate(width / 4 - centerX, height / 2 - centerY)
        .scale(1);

      svg.call((zoom as any).transform, initialTransform);
      setTransform({
        x: initialTransform.x,
        y: initialTransform.y,
        k: initialTransform.k
      });
    }
  };

  // Helper function to estimate text width (approx calculation)
  const getTextWidth = (text: string): number => {
    return text.length * 7; // Simple approximation, 7px per character
  };

  // Download the mind map
  const downloadMindMap = () => {
    if (!svgRef.current) return;

    // Create a clone of the SVG for download
    const svgElement = svgRef.current.cloneNode(true) as SVGElement;

    // Get the g element with the mind map content
    const gElement = svgElement.querySelector('.mindmap-container-g');

    if (!gElement) {
      console.error('Mind map content not found');
      return;
    }

    // Get the current transform and BBox
    const bbox = (gElement as SVGGraphicsElement).getBBox();

    // Add some padding
    const padding = 50;
    const width = bbox.width + padding * 2;
    const height = bbox.height + padding * 2;

    // Set the viewBox attribute to focus on the content
    svgElement.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);
    svgElement.setAttribute('width', `${width}`);
    svgElement.setAttribute('height', `${height}`);

    // Simplify the transform to prevent issues during export
    // This retains the zoom level but centers the content
    gElement.setAttribute('transform', `scale(${transform.k})`);

    // Convert to string
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

    if (downloadFormat === 'svg') {
      saveAs(svgBlob, 'mindmap.svg');
      return;
    }

    // For PNG, we need to convert SVG to canvas
    const canvas = document.createElement('canvas');
    // Make canvas bigger for better quality
    const scale = 2; // Higher quality export
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    const DOMURL = window.URL || window.webkitURL || window;

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);

    const img = new Image();
    const svgUrl = DOMURL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'mindmap.png');
        }
      }, 'image/png', 0.95); // Higher quality PNG
    };

    img.src = svgUrl;
  };

  // Update mind map when markdown changes
  useEffect(() => {
    renderMindMap();
  }, [markdown]);

  // Handle window resize (for responsiveness)
  useEffect(() => {
    const handleResize = () => {
      renderMindMap();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Reset zoom level
  const resetZoom = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([minZoom, maxZoom]);

    // Reset to initial transform
    svg.transition().duration(750).call(
      (zoom as any).transform,
      d3.zoomIdentity.translate(width / 4, height / 2).scale(1)
    );

    setTransform({ x: width / 4, y: height / 2, k: 1 });
    setZoomLevel(1);
  };

  // Zoom in button handler
  const zoomIn = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([minZoom, maxZoom]);

    const newZoom = Math.min(transform.k * 1.2, maxZoom);

    svg.transition().duration(300).call(
      (zoom as any).transform,
      d3.zoomIdentity.translate(transform.x, transform.y).scale(newZoom)
    );

    setTransform({ ...transform, k: newZoom });
    setZoomLevel(newZoom);
  };

  // Zoom out button handler
  const zoomOut = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([minZoom, maxZoom]);

    const newZoom = Math.max(transform.k / 1.2, minZoom);

    svg.transition().duration(300).call(
      (zoom as any).transform,
      d3.zoomIdentity.translate(transform.x, transform.y).scale(newZoom)
    );

    setTransform({ ...transform, k: newZoom });
    setZoomLevel(newZoom);
  };

  return (
    <div className="markdown-mindmap-container">
      <div className="markdown-editor">
        <h3>Markdown Editor</h3>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="markdown-textarea"
          placeholder="Enter your markdown content here..."
        />
        <div className="markdown-preview">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>

      <div className="mindmap-container">
        <h3>Mind Map Preview</h3>
        <div className="controls-container">
          <div className="download-controls">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
            >
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
            <button onClick={downloadMindMap}>
              Download Mind Map
            </button>
          </div>
          <div className="zoom-controls">
            <button onClick={zoomOut} title="Zoom Out">
              −
            </button>
            <span className="zoom-level">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button onClick={zoomIn} title="Zoom In">
              +
            </button>
            <button onClick={resetZoom} title="Reset Zoom">
              Reset
            </button>
          </div>
        </div>
        <div className="mindmap-svg-container">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="mindmap-svg"
          />
          <div className="zoom-instructions">
            <small>Tip: Use mouse wheel to zoom, drag to pan</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownMindMap;
