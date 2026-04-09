/**
 * Color relationship graph — maps which colors sit on which backgrounds
 * and tracks contrast ratios between connected pairs.
 */

import type { OKLCH } from '../utils/color-space.js';
import { contrastRatio } from './contrast.js';
import type { ClassifiedColor, ColorRole } from './classifier.js';

export interface GraphNode {
  id: string;
  role: ColorRole;
  color: string; // hex
  oklch: OKLCH;
  usage: number;
}

export interface GraphEdge {
  from: string; // node id (parent/background)
  to: string; // node id (child/foreground)
  relation: 'contains' | 'text-on-bg' | 'border-on-bg' | 'accent-on-bg';
  contrast: number;
}

export interface ColorGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Build a color relationship graph from classified colors.
 */
export function buildColorGraph(colors: ClassifiedColor[]): ColorGraph {
  const nodes: GraphNode[] = colors.map((c) => ({
    id: c.role,
    role: c.role,
    color: c.value,
    oklch: c.oklch,
    usage: c.usage,
  }));

  const edges: GraphEdge[] = [];

  // Find background nodes
  const bgNodes = nodes.filter((n) => n.role.startsWith('background.'));
  const pageNode = bgNodes.find((n) => n.role === 'background.page');
  const surfaceNode = bgNodes.find((n) => n.role === 'background.surface');

  if (!pageNode) return { nodes, edges };

  // Connect surfaces to page
  for (const bg of bgNodes) {
    if (bg.role !== 'background.page') {
      edges.push({
        from: pageNode.id,
        to: bg.id,
        relation: 'contains',
        contrast: contrastRatio(pageNode.color, bg.color),
      });
    }
  }

  // Connect text/brand/status to their likely parent backgrounds
  const primaryBg = surfaceNode || pageNode;

  for (const node of nodes) {
    if (node.role.startsWith('background.')) continue;

    const relation = node.role.startsWith('text.')
      ? 'text-on-bg'
      : node.role.startsWith('border.')
      ? 'border-on-bg'
      : 'accent-on-bg';

    // Connect to both page and surface bg
    edges.push({
      from: pageNode.id,
      to: node.id,
      relation,
      contrast: contrastRatio(pageNode.color, node.color),
    });

    if (surfaceNode && surfaceNode.id !== pageNode.id) {
      edges.push({
        from: surfaceNode.id,
        to: node.id,
        relation,
        contrast: contrastRatio(surfaceNode.color, node.color),
      });
    }
  }

  return { nodes, edges };
}

/**
 * Export graph as SVG string for visualization.
 */
export function graphToSvg(graph: ColorGraph): string {
  const width = 800;
  const padding = 60;
  const nodeRadius = 24;
  const rowHeight = 80;

  // Group nodes by category
  const groups: Record<string, GraphNode[]> = {};
  for (const node of graph.nodes) {
    const category = node.role.split('.')[0];
    if (!groups[category]) groups[category] = [];
    groups[category].push(node);
  }

  const groupNames = Object.keys(groups);
  const height = padding * 2 + groupNames.length * rowHeight + 60;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" font-family="system-ui, sans-serif">\n`;
  svg += `  <rect width="${width}" height="${height}" fill="#0a0a0b" rx="12"/>\n`;
  svg += `  <text x="${padding}" y="36" fill="#e4e4e7" font-size="16" font-weight="600">Nightfall Color Graph</text>\n`;

  const nodePositions: Record<string, { x: number; y: number }> = {};

  // Draw nodes grouped by category
  groupNames.forEach((group, gi) => {
    const y = padding + 40 + gi * rowHeight;
    const nodes = groups[group];
    const startX = padding + 100;

    svg += `  <text x="${padding}" y="${y + 6}" fill="#71717a" font-size="11" text-transform="uppercase">${group}</text>\n`;

    nodes.forEach((node, ni) => {
      const x = startX + ni * (nodeRadius * 3 + 16);
      nodePositions[node.id] = { x, y };

      // Node circle with actual color
      svg += `  <circle cx="${x}" cy="${y}" r="${nodeRadius}" fill="${node.color}" stroke="#1e2130" stroke-width="1.5"/>\n`;
      // Label below
      const label = node.role.split('.')[1] || node.role;
      svg += `  <text x="${x}" y="${y + nodeRadius + 14}" fill="#71717a" font-size="9" text-anchor="middle">${label}</text>\n`;
    });
  });

  // Draw edges
  for (const edge of graph.edges) {
    const from = nodePositions[edge.from];
    const to = nodePositions[edge.to];
    if (!from || !to) continue;

    const contrastLabel = edge.contrast.toFixed(1) + ':1';
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;

    svg += `  <line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#1e2130" stroke-width="1" opacity="0.5"/>\n`;
    svg += `  <text x="${midX}" y="${midY - 4}" fill="#71717a" font-size="8" text-anchor="middle">${contrastLabel}</text>\n`;
  }

  svg += '</svg>';
  return svg;
}
