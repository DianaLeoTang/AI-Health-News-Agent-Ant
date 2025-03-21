/*
 * @Author: Diana Tang
 * @Date: 2025-03-21 17:06:14
 * @LastEditors: Diana Tang
 * @Description: some description
 * @FilePath: /AI-Health-News-Agent-Ant/src/pages/MarkdownMindMap/MarkdownMind.tsx
 */
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import * as d3 from 'd3';
import { saveAs } from 'file-saver';
import './index.css';

interface MarkdownMindMapProps {
  initialMarkdown?: string;
  width?: number;
  height?: number;
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

const MarkdownMind: React.FC<MarkdownMindMapProps> = ({
  initialMarkdown = '# Root Heading\n\n## Sub Heading 1\n\nContent 1\n\n### Deeper level\n\nMore content\n\n## Sub Heading 2\n\nContent 2',
  width = 800,
  height = 600,
}) => {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const svgRef = useRef<SVGSVGElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<string>('png');

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

    const g = svg.append('g');

    // Parse markdown to tree
    const root = parseMarkdownToTree(markdown);

    // Create hierarchical layout
    const treeLayout = d3.tree<MindMapNode>().size([height - 100, width / 2 - 100]);

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

    g.attr('transform', `translate(${width / 4 - centerX},${height / 2 - centerY})`);
  };

  // Download the mind map
  const downloadMindMap = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

    if (downloadFormat === 'svg') {
      saveAs(svgBlob, 'mindmap.svg');
      return;
    }

    // For PNG, we need to convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const DOMURL = window.URL || window.webkitURL || window;

    canvas.width = width;
    canvas.height = height;

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const img = new Image();
    const svgUrl = DOMURL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'mindmap.png');
        }
      });
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
        <div className="mindmap-svg-container">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="mindmap-svg"
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownMind;
