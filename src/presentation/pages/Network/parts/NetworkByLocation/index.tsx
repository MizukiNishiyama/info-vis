import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { hometownColorMap } from "@/src/consts/node-colors";
import { WIDTH } from "@/src/consts/styles";
import { FeaturedTrack } from "@/src/types/featured-track";
import { Link } from "@/src/types/link";
import { NodeType } from "@/src/types/node";
import { Rapper } from "@/src/types/rapper";
import { filterTracksByArtistIds } from "@/src/utils/filter";

const HEIGHT = innerHeight / 1.3;
const LINK_DISTANCE = 100;
const LINK_DISTANCE_CLOSE = 100;
const CHARGE_STRENGTH = -600;
const INITIAL_ZOOM_SCALE = 0.8;
const INITIAL_ZOOM_TRANSLATE: [number, number] = [0, 0];
const ZOOM_SCALE_EXTENT: [number, number] = [0.5, 5];
const NODE_RADIUS_BASE = 6;
const STROKE_WIDTH = 14;
const LINK_WIDTH_SCALE = 2;
const LABEL_FONT_SIZE = "12px";
const LINK_DEFAULT_COLOR = "#e5e7eb";
const LINK_OPACITY_DEFAULT = 0.6;
const DEFAULT_IMAGE_URL = "/logo.png";

type ArtistNetworkProps = {
  rappers: Rapper[];
  tracks: FeaturedTrack[];
  rapperToLocation: Map<string, string> | undefined;
  selectedLocation: string | undefined;
  focusedArtistId: string | undefined;
  rapperDetailData: d3.DSVRowArray<string> | null;
  setFocusedArtistId: (artistId: string | undefined) => void;
};

export const NetworkByLocation: React.FC<ArtistNetworkProps> = (props) => {
  const {
    rappers,
    tracks,
    rapperToLocation,
    rapperDetailData,
    selectedLocation,
    focusedArtistId,
    setFocusedArtistId,
  } = props;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodeElementsRef = useRef<d3.Selection<SVGGElement, NodeType, SVGGElement, unknown>>();
  const linkElementsRef = useRef<d3.Selection<SVGLineElement, Link, SVGGElement, unknown>>();
  const uniqueLinksRef = useRef<Link[]>([]);

  const createData = () => {
    const artistIds = new Set(rappers.map((rapper) => rapper.id));
    const filteredTracks = filterTracksByArtistIds(tracks, artistIds);

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
        const id = data.id;
        const images = data.images || "";
        idToImageUrl[id] = images.split(",").map((url) => url.trim())[0];
      });
    }

    const nodes: NodeType[] = Array.from(selectedArtistIds).map((id) => ({
      id,
      name: idToName[id] || id,
      hometown: rapperToLocation && rapperToLocation.get(id),
      imageUrl: idToImageUrl[id] || DEFAULT_IMAGE_URL,
    }));

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

    const linkCountMap: { [key: string]: number } = {};
    links.forEach((link) => {
      const key = [link.source, link.target].sort().join("-");
      linkCountMap[key] = (linkCountMap[key] || 0) + 1;
    });

    const uniqueLinks: Link[] = [];
    const linkSet = new Set<string>();
    links.forEach((link) => {
      const key = [link.source, link.target].sort().join("-");
      if (!linkSet.has(key)) {
        linkSet.add(key);
        const distance =
          rapperToLocation &&
          rapperToLocation.get(link.source as string) &&
          rapperToLocation.get(link.target as string)
            ? LINK_DISTANCE_CLOSE
            : LINK_DISTANCE;
        uniqueLinks.push({
          ...link,
          count: linkCountMap[key],
          distance: distance,
        });
      }
    });

    uniqueLinksRef.current = uniqueLinks;
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

  // ハイライト処理を関数化
  const applyFocusedHighlight = () => {
    const nodeGroups = nodeElementsRef.current;
    const linkElements = linkElementsRef.current;
    const uniqueLinks = uniqueLinksRef.current;

    if (!nodeGroups || !linkElements || !uniqueLinks) return;

    if (!focusedArtistId) {
      // フォーカスなし
      nodeGroups.attr("opacity", 1);
      linkElements.attr("stroke", LINK_DEFAULT_COLOR).attr("stroke-opacity", LINK_OPACITY_DEFAULT);
      return;
    }

    const connectedNodes = new Set<string>();
    uniqueLinks.forEach((l) => {
      const sourceId = typeof l.source === "object" ? l.source.id : l.source;
      const targetId = typeof l.target === "object" ? l.target.id : l.target;
      if (sourceId === focusedArtistId || targetId === focusedArtistId) {
        connectedNodes.add(sourceId);
        connectedNodes.add(targetId);
      }
    });

    nodeGroups.attr("opacity", (d) =>
      connectedNodes.has(d.id) || d.id === focusedArtistId ? 1 : 0.3,
    );

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
  };

  const applyLocationHighlight = () => {
    const nodeGroups = nodeElementsRef.current;
    const linkElements = linkElementsRef.current;
    const uniqueLinks = uniqueLinksRef.current;

    if (!nodeGroups || !linkElements || !uniqueLinks) return;

    // もしfocusedArtistIdがある場合はlocationハイライトは適用しない、もしくは後でfocused highlightを再適用
    if (focusedArtistId) {
      // focusedArtist優先の場合は一旦何もせずreturnか、もしくは
      // locationハイライト後に最後にapplyFocusedHighlight()を呼ぶこともできる
      return;
    }

    // リセット
    nodeGroups.attr("opacity", 1);
    linkElements.attr("stroke", LINK_DEFAULT_COLOR).attr("stroke-opacity", LINK_OPACITY_DEFAULT);

    if (!selectedLocation) {
      return;
    }

    const selectedNodes = new Set<string>();
    nodeGroups.each((d) => {
      if (d.hometown === selectedLocation) {
        selectedNodes.add(d.id);
      }
    });

    const connectedNodes = new Set<string>(selectedNodes);
    uniqueLinks.forEach((l) => {
      const sourceId = typeof l.source === "object" ? l.source.id : l.source;
      const targetId = typeof l.target === "object" ? l.target.id : l.target;
      if (selectedNodes.has(sourceId) || selectedNodes.has(targetId)) {
        connectedNodes.add(sourceId);
        connectedNodes.add(targetId);
      }
    });

    nodeGroups.attr("opacity", (d) => (connectedNodes.has(d.id) ? 1 : 0.3));

    linkElements
      .attr("stroke", (l) => {
        const sourceId = typeof l.source === "object" ? l.source.id : l.source;
        const targetId = typeof l.target === "object" ? l.target.id : l.target;
        return selectedNodes.has(sourceId) || selectedNodes.has(targetId)
          ? "#2196f3"
          : LINK_DEFAULT_COLOR;
      })
      .attr("stroke-opacity", (l) => {
        const sourceId = typeof l.source === "object" ? l.source.id : l.source;
        const targetId = typeof l.target === "object" ? l.target.id : l.target;
        return selectedNodes.has(sourceId) || selectedNodes.has(targetId)
          ? 1
          : LINK_OPACITY_DEFAULT;
      });
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

    const zoomGroup = svg.append("g");

    const initialZoom = d3.zoomIdentity
      .translate(INITIAL_ZOOM_TRANSLATE[0], INITIAL_ZOOM_TRANSLATE[1])
      .scale(INITIAL_ZOOM_SCALE);

    const simulation = d3
      .forceSimulation<NodeType>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeType, Link>(uniqueLinks)
          .id((d) => d.id)
          .distance((d) => d.distance || LINK_DISTANCE),
      )
      .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2));

    const linkElements = zoomGroup
      .append("g")
      .attr("stroke", LINK_DEFAULT_COLOR)
      .attr("stroke-opacity", LINK_OPACITY_DEFAULT)
      .selectAll<SVGLineElement, Link>("line")
      .data(uniqueLinks)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => Math.sqrt(d.count || 0.5) * LINK_WIDTH_SCALE);

    linkElementsRef.current = linkElements;

    const defs = svg.append("defs");
    defs
      .selectAll("clipPath")
      .data(nodes)
      .enter()
      .append("clipPath")
      .attr("id", (d) => `clip-${d.id}`)
      .append("circle")
      .attr("r", (d) => Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("cx", 0)
      .attr("cy", 0);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("text-align", "center")
      .style("padding", "8px")
      .style("font", "12px sans-serif")
      .style("background", "lightsteelblue")
      .style("border", "0px")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const nodeGroups = zoomGroup
      .append("g")
      .selectAll<SVGGElement, NodeType>("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("click", (event, clickedNode) => {
        event.stopPropagation();
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
      )
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(d.hometown || "Unknown")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    nodeElementsRef.current = nodeGroups;

    nodeGroups
      .append("circle")
      .attr("r", (d) => Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("fill", "none")
      .attr("stroke", (d) => hometownColorMap[d.hometown || ""] || "#000")
      .attr("stroke-width", STROKE_WIDTH);

    nodeGroups
      .append("image")
      .attr("href", (d) => d.imageUrl || DEFAULT_IMAGE_URL)
      .attr("width", (d) => 2 * Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("height", (d) => 2 * Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("x", (d) => -Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("y", (d) => -Math.sqrt(linkCount[d.id] || 1) * NODE_RADIUS_BASE)
      .attr("clip-path", (d) => `url(#clip-${d.id})`);

    const labels = zoomGroup
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("dx", 12)
      .attr("dy", 4)
      .text((d) => d.name)
      .style("font-size", LABEL_FONT_SIZE);

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

      nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);

      labels.attr("x", (d) => d.x! + 12).attr("y", (d) => d.y! + 4);
    });

    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent(ZOOM_SCALE_EXTENT)
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        zoomGroup.attr("transform", event.transform.toString());
      });

    svg.call(zoomBehavior).call(zoomBehavior.transform, initialZoom);

    // 描画が完了した後、focusedArtistIdがあればハイライトを適用
    if (focusedArtistId) {
      requestAnimationFrame(() => {
        applyFocusedHighlight();
      });
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [rappers, tracks, rapperToLocation, rapperDetailData, setFocusedArtistId]);

  useEffect(() => {
    // focusedArtistIdの変更時にハイライト
    applyFocusedHighlight();
  }, [focusedArtistId]);

  useEffect(() => {
    // selectedLocationの変更時にハイライト
    // focusedArtistIdがない場合のみlocationハイライトを適用（優先度：focusedArtistId > selectedLocation）
    if (!focusedArtistId) {
      applyLocationHighlight();
    } else {
      // フォーカスがある場合は、locationハイライトでは上書きせず、focusハイライト維持
      applyFocusedHighlight();
    }
  }, [selectedLocation]);

  return <svg ref={svgRef}></svg>;
};
