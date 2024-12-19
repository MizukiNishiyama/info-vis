import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { FeaturedTrack } from "@/src/types/featured-track";
import { Link } from "@/src/types/link";
import { NodeType } from "@/src/types/node";
import { Rapper } from "@/src/types/rapper";
import { filterTracksByArtistIds } from "@/src/utils/filter";

const WIDTH = innerWidth / 1.3;
const HEIGHT = innerHeight / 1.4;
const LINK_DISTANCE = 500;
const CHARGE_STRENGTH = -200;
const INITIAL_ZOOM_SCALE = 0.6;
const INITIAL_ZOOM_TRANSLATE: [number, number] = [50, 150];
const ZOOM_SCALE_EXTENT: [number, number] = [0.5, 5];
const NODE_RADIUS_BASE = 12;
const LINK_WIDTH_SCALE = 2;
const LINK_DEFAULT_COLOR = "#f9fafb";
const LINK_OPACITY_DEFAULT = 0.7;
const DEFAULT_IMAGE_URL = "/logo.png";

type ArtistNetworkProps = {
  rappers: Rapper[];
  tracks: FeaturedTrack[];
  rapperDetailData: d3.DSVRowArray<string> | null;
  focusedArtistId: string | undefined;
  setFocusedArtistId: (artistId: string | undefined) => void;
};

export const BubbleNetwork: React.FC<ArtistNetworkProps> = (props) => {
  const { rappers, tracks, rapperDetailData, focusedArtistId, setFocusedArtistId } = props;
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Refs to store D3 selections for nodes and links
  const nodeGroupsRef = useRef<d3.Selection<SVGGElement, NodeType, SVGGElement, unknown>>();
  const linkElementsRef = useRef<d3.Selection<SVGLineElement, Link, SVGGElement, unknown>>();
  const uniqueLinksRef = useRef<Link[]>([]);

  const createData = () => {
    const artistIds = new Set(rappers.map((rapper) => rapper.id));
    const filteredTracks = filterTracksByArtistIds(tracks, artistIds);

    // Extract artist IDs involved in the selected tracks
    const selectedArtistIds = new Set<string>();
    filteredTracks.forEach((track) => {
      track.artistIds.forEach((artistId) => {
        if (artistIds.has(artistId)) {
          selectedArtistIds.add(artistId);
        }
      });
    });

    const idToName: { [key: string]: string } = {};
    rappers.forEach((rapper) => {
      idToName[rapper.id] = rapper.name;
    });

    const idToImageUrl: { [key: string]: string } = {};
    if (rapperDetailData) {
      rapperDetailData.forEach((data) => {
        // Assuming 'id' and 'images' are columns in rapperDetailData
        const id = data.id;
        const images = data.images || "";
        idToImageUrl[id] = images.split(",").map((url) => url.trim())[0];
      });
    }

    // Create node data
    const nodes: NodeType[] = Array.from(selectedArtistIds).map((id) => ({
      id,
      name: idToName[id] || id,
      imageUrl: idToImageUrl[id] || "",
    }));

    // Create link data
    const links: Link[] = [];

    filteredTracks.forEach((track) => {
      const artists = track.artistIds;
      for (let i = 0; i < artists.length; i++) {
        for (let j = i + 1; j < artists.length; j++) {
          links.push({
            source: artists[i],
            target: artists[j],
            count: 1,
          });
        }
      }
    });

    // Aggregate link counts
    const linkCountMap: { [key: string]: number } = {};
    links.forEach((link) => {
      const key = [link.source, link.target].sort().join("-");
      linkCountMap[key] = (linkCountMap[key] || 0) + 1;
    });

    // Create unique links with aggregated counts
    const uniqueLinks: Link[] = [];
    const linkSet = new Set<string>();
    links.forEach((link) => {
      const key = [link.source, link.target].sort().join("-");
      if (!linkSet.has(key)) {
        linkSet.add(key);
        uniqueLinks.push({
          ...link,
          count: linkCountMap[key],
        });
      }
    });

    uniqueLinksRef.current = uniqueLinks; // Save uniqueLinks for external access

    return { nodes, uniqueLinks };
  };

  const getLinkCount = (uniqueLinks: Link[]) => {
    const linkCount: { [key: string]: number } = {};
    uniqueLinks.forEach((link) => {
      const sourceId =
        typeof link.source === "object" && "id" in link.source
          ? (link.source as NodeType).id
          : link.source;
      const targetId =
        typeof link.target === "object" && "id" in link.target
          ? (link.target as NodeType).id
          : link.target;

      linkCount[sourceId] = (linkCount[sourceId] || 0) + 1;
      linkCount[targetId] = (linkCount[targetId] || 0) + 1;
    });

    return linkCount;
  };

  useEffect(() => {
    const { nodes, uniqueLinks } = createData();
    d3.select(svgRef.current).selectAll("*").remove();

    if (!svgRef.current) return;

    const linkCount = getLinkCount(uniqueLinks);

    const svg = d3
      .select<SVGSVGElement, unknown>(svgRef.current)
      .attr("width", WIDTH)
      .attr("height", HEIGHT);

    // Define clipPath for node images
    const defs = svg.append("defs");

    defs
      .selectAll("clipPath")
      .data(nodes)
      .enter()
      .append("clipPath")
      .attr("id", (d) => `clip-${d.id}`)
      .append("circle")
      .attr("r", (d) => Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE) // Radius based on linkCount
      .attr("cx", 0)
      .attr("cy", 0);

    const zoomGroup = svg.append("g");

    // Add a transparent rectangle for background clicks to reset focus
    zoomGroup
      .append("rect")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .style("fill", "none") // or "transparent"
      .style("pointer-events", "all")
      .lower() // Send to back
      .on("click", () => {
        setFocusedArtistId(undefined);
      });

    const initialZoom = d3.zoomIdentity
      .translate(INITIAL_ZOOM_TRANSLATE[0], INITIAL_ZOOM_TRANSLATE[1])
      .scale(INITIAL_ZOOM_SCALE);

    const simulation = d3
      .forceSimulation<NodeType>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeType, d3.SimulationLinkDatum<NodeType>>(uniqueLinks as Link[])
          .id((d) => d.id)
          .distance(LINK_DISTANCE)
          .strength(1), // Increase strength for more rigid links
      )
      .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE + 5),
      ); // Add collision force

    // Create link elements
    const linkElements = zoomGroup
      .append("g")
      .attr("stroke", LINK_DEFAULT_COLOR)
      .attr("stroke-opacity", LINK_OPACITY_DEFAULT)
      .selectAll<SVGLineElement, Link>("line")
      .data(uniqueLinks)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => Math.sqrt(d.count || 0.5) * LINK_WIDTH_SCALE);

    linkElementsRef.current = linkElements; // Save linkElements for external access

    // Create node groups
    const nodeGroups = zoomGroup
      .append("g")
      .selectAll<SVGGElement, NodeType>("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("click", (event, clickedNode) => {
        // Prevent the background click handler from being triggered
        event.stopPropagation();

        // Set the focused artist ID
        setFocusedArtistId(clickedNode.id);
      })
      .call(
        d3
          .drag<SVGGElement, NodeType>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    nodeGroupsRef.current = nodeGroups; // Save nodeGroups for external access

    // Append images to node groups
    nodeGroups
      .append("image")
      .attr("href", (d) =>
        d.imageUrl && d.imageUrl.trim() !== "" ? d.imageUrl : DEFAULT_IMAGE_URL,
      )
      .attr("x", (d) => -Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("y", (d) => -Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("width", (d) => 2 * Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("height", (d) => 2 * Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("clip-path", (d) => `url(#clip-${d.id})`);

    // Simulation tick event
    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d: d3.SimulationLinkDatum<NodeType>) =>
          typeof d.source === "object" ? d.source.x! : 0,
        )
        .attr("y1", (d: d3.SimulationLinkDatum<NodeType>) =>
          typeof d.source === "object" ? d.source.y! : 0,
        )
        .attr("x2", (d: d3.SimulationLinkDatum<NodeType>) =>
          typeof d.target === "object" ? d.target.x! : 0,
        )
        .attr("y2", (d: d3.SimulationLinkDatum<NodeType>) =>
          typeof d.target === "object" ? d.target.y! : 0,
        );

      // Update node group positions
      nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Setup zoom and pan
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent(ZOOM_SCALE_EXTENT)
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        zoomGroup.attr("transform", event.transform.toString());
      });

    svg.call(zoomBehavior).call(zoomBehavior.transform, initialZoom);

    return () => {
      simulation.stop();
    };
  }, [rappers, tracks, rapperDetailData, setFocusedArtistId]);

  // useEffect to handle highlighting based on focusedArtistId
  useEffect(() => {
    const nodeGroups = nodeGroupsRef.current;
    const linkElements = linkElementsRef.current;
    const uniqueLinks = uniqueLinksRef.current;

    if (!nodeGroups || !linkElements || !uniqueLinks) return;

    if (!focusedArtistId) {
      // If no artist is focused, reset all styles
      nodeGroups.attr("opacity", 1);
      linkElements.attr("stroke", LINK_DEFAULT_COLOR).attr("stroke-opacity", LINK_OPACITY_DEFAULT);
      return;
    }

    // Identify connected nodes
    const connectedNodes = new Set<string>();
    uniqueLinks.forEach((l) => {
      const sourceId = typeof l.source === "object" ? l.source.id : l.source;
      const targetId = typeof l.target === "object" ? l.target.id : l.target;

      if (sourceId === focusedArtistId || targetId === focusedArtistId) {
        connectedNodes.add(sourceId);
        connectedNodes.add(targetId);
      }
    });

    // Update node opacities
    nodeGroups.attr("opacity", (d) =>
      connectedNodes.has(d.id) || d.id === focusedArtistId ? 1 : 0.3,
    );

    // Update link styles
    linkElements
      .attr("stroke", (l) => {
        const sourceId = typeof l.source === "object" ? l.source.id : l.source;
        const targetId = typeof l.target === "object" ? l.target.id : l.target;

        return sourceId === focusedArtistId || targetId === focusedArtistId
          ? "#2196f3"
          : LINK_DEFAULT_COLOR;
      })
      .attr("stroke-opacity", (l) => {
        const sourceId = typeof l.source === "object" ? l.source.id : l.source;
        const targetId = typeof l.target === "object" ? l.target.id : l.target;

        return sourceId === focusedArtistId || targetId === focusedArtistId
          ? 1
          : LINK_OPACITY_DEFAULT;
      });
  }, [focusedArtistId]);

  return <svg ref={svgRef} />;
};
