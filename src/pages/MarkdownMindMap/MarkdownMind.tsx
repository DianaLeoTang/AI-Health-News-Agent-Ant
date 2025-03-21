import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import * as d3 from 'd3';
import { saveAs } from 'file-saver';
import {Button,Select} from 'antd'
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
// 创建一个引用来存储 zoom 行为
  const zoomBehaviorRef = useRef<any>(null);
  // 添加一个下载状态，防止重复点击
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

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
      .filter(event => {
        // 允许滚轮事件、指针事件，但禁用双击缩放
        return !event.ctrlKey && !event.button && event.type !== 'dblclick';
      })
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setTransform({ x: event.transform.x, y: event.transform.y, k: event.transform.k });
        setZoomLevel(event.transform.k);
      });

      // Store zoom behavior for button usage
      zoomBehaviorRef.current = zoom;
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
    if (!svgRef.current || isDownloading) return;

    setIsDownloading(true);

    // 创建一个新的 SVG 元素，而不是克隆现有元素
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svgElement = document.createElementNS(svgNamespace, "svg");

    // 准备下载的 SVG
    const prepareDownloadSvg = async () => {
      try {
        // 解析markdown到树结构并获取适当的尺寸
        const root = parseMarkdownToTree(markdown);
        const hierarchy = d3.hierarchy(root);
        const treeLayout = d3.tree<MindMapNode>()
          .size([height - 100, width / 2 - 100])
          .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

        const treeData = treeLayout(hierarchy);

        // 计算边界框
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        treeData.descendants().forEach(node => {
          const nodeWidth = getTextWidth(node.data.name) + 20; // 文本宽度加上一些填充
          const nodeHeight = 30; // 估计节点高度

          minX = Math.min(minX, node.y - (node.children ? nodeWidth : 0));
          minY = Math.min(minY, node.x - nodeHeight/2);
          maxX = Math.max(maxX, node.y + (node.children ? 0 : nodeWidth));
          maxY = Math.max(maxY, node.x + nodeHeight/2);
        });

        // 添加填充
        const padding = 50;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        const svgWidth = maxX - minX;
        const svgHeight = maxY - minY;

        // 设置SVG属性
        svgElement.setAttribute("width", String(svgWidth));
        svgElement.setAttribute("height", String(svgHeight));
        svgElement.setAttribute("viewBox", `${minX} ${minY} ${svgWidth} ${svgHeight}`);

        // 创建一个白色背景
        const background = document.createElementNS(svgNamespace, "rect");
        background.setAttribute("x", String(minX));
        background.setAttribute("y", String(minY));
        background.setAttribute("width", String(svgWidth));
        background.setAttribute("height", String(svgHeight));
        background.setAttribute("fill", "white");
        svgElement.appendChild(background);

        // 创建主容器组
        const g = document.createElementNS(svgNamespace, "g");
        svgElement.appendChild(g);

        // 添加链接
        treeData.links().forEach(link => {
          const path = document.createElementNS(svgNamespace, "path");
          path.setAttribute("d", `M${link.source.y},${link.source.x}
                C${(link.source.y + link.target.y) / 2},${link.source.x}
                 ${(link.source.y + link.target.y) / 2},${link.target.x}
                 ${link.target.y},${link.target.x}`);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "#555");
          path.setAttribute("stroke-width", "1.5");
          g.appendChild(path);
        });

        // 添加节点
        treeData.descendants().forEach(node => {
          const nodeGroup = document.createElementNS(svgNamespace, "g");
          nodeGroup.setAttribute("transform", `translate(${node.y},${node.x})`);

          // 添加节点圆圈
          const circle = document.createElementNS(svgNamespace, "circle");
          circle.setAttribute("r", "5");
          circle.setAttribute("fill", node.depth === 0 ? "#ff7700" : node.children ? "#555" : "#999");
          nodeGroup.appendChild(circle);

          // 添加标签背景
          const textWidth = getTextWidth(node.data.name);
          const rect = document.createElementNS(svgNamespace, "rect");
          rect.setAttribute("x", node.children ? String(-8 - textWidth) : "8");
          rect.setAttribute("y", "-10");
          rect.setAttribute("width", String(textWidth + 10));
          rect.setAttribute("height", "20");
          rect.setAttribute("rx", "3");
          rect.setAttribute("ry", "3");
          rect.setAttribute("fill", "white");
          rect.setAttribute("fill-opacity", "0.8");
          nodeGroup.appendChild(rect);

          // 添加文本标签
          const text = document.createElementNS(svgNamespace, "text");
          text.setAttribute("dy", ".31em");
          text.setAttribute("x", node.children ? "-8" : "8");
          text.setAttribute("text-anchor", node.children ? "end" : "start");
          text.setAttribute("font-size", "12px");
          text.setAttribute("font-family", "Arial, sans-serif");
          text.textContent = node.data.name;
          nodeGroup.appendChild(text);

          g.appendChild(nodeGroup);
        });

        // 转换为字符串
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        if (downloadFormat === 'svg') {
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          saveAs(svgBlob, 'mindmap.svg');
          setIsDownloading(false);
          return;
        }

        // PNG转换
        return new Promise<void>((resolve, reject) => {
          const canvas = document.createElement('canvas');
          const scale = 2; // 更高质量
          canvas.width = svgWidth * scale;
          canvas.height = svgHeight * scale;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('无法获取Canvas上下文'));
            return;
          }

          // 设置白色背景
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);

          // 从SVG字符串创建图片对象
          const img = new Image();

          // 重要：等待图片加载完成
          img.onload = () => {
            ctx.drawImage(img, 0, 0);

            // 转换为Blob并下载
            canvas.toBlob((blob) => {
              if (blob) {
                saveAs(blob, 'mindmap.png');
                resolve();
              } else {
                reject(new Error('无法创建PNG Blob'));
              }
              setIsDownloading(false);
            }, 'image/png', 0.95);
          };

          img.onerror = (err) => {
            console.error('图片加载错误', err);
            reject(err);
            setIsDownloading(false);
          };

          // 使用DataURL，而不是Blob URL
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const reader = new FileReader();
          reader.onload = () => {
            img.src = reader.result as string;
          };
          reader.onerror = (err) => {
            reject(err);
            setIsDownloading(false);
          };
          reader.readAsDataURL(svgBlob);
        });
      } catch (error) {
        console.error('下载过程中出错:', error);
        setIsDownloading(false);
      }
    };

    prepareDownloadSvg();
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
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const svg = d3.select(svgRef.current);

    // Get the root node for centering purposes
    const root = parseMarkdownToTree(markdown);
    const hierarchy = d3.hierarchy(root);
    const treeLayout = d3.tree<MindMapNode>().size([height - 100, width / 2 - 100]);
    const treeData = treeLayout(hierarchy);
    const rootNode = treeData.descendants()[0];

    const centerX = width / 4 - rootNode.y;
    const centerY = height / 2 - rootNode.x;

    // Apply reset transform with animation using the stored zoom behavior
    svg.transition().duration(750).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity.translate(centerX, centerY).scale(1)
    );

    // Update our state
    setTransform({ x: centerX, y: centerY, k: 1 });
    setZoomLevel(1);

  };

  // Zoom in button handler
  const zoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const svg = d3.select(svgRef.current);

    // 计算新的缩放级别
    const newZoom = Math.min(transform.k * 1.2, maxZoom);

    // 使用与滚轮事件相同的 zoom 行为
    svg.transition().duration(300).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity.translate(transform.x, transform.y).scale(newZoom)
    );
  };

  // Zoom out button handler
  const zoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const svg = d3.select(svgRef.current);

    const newZoom = Math.max(transform.k / 1.2, minZoom);

    svg.transition().duration(300).call(
      zoomBehaviorRef.current.transform,
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
        <h3>思维导图预览</h3>
        <div className="controls-container">
          <div className="download-controls">
            <Select
              defaultValue="lucy"
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              options={[
                { value: 'PNG', label: 'PNG' },
                { value: 'SVG', label: 'SVG' }
              ]}
            >
            </Select>
            <Button type="primary" onClick={downloadMindMap}>
              下载思维导图
            </Button>
            <Button onClick={zoomOut} title="Zoom Out">
              −
            </Button>
            <span type="text" className="zoom-level">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button onClick={zoomIn} title="Zoom In" className='zoom-in'>
              +
            </Button>
            <Button type="primary" onClick={resetZoom} title="Reset Zoom">
              重置
            </Button>
          </div>
          <div className="zoom-instructions">
            <middle>Tip: Use mouse wheel to zoom, drag to pan</middle>
          </div>
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

export default MarkdownMindMap;
