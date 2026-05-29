import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "CC Bins vs Competitor Feature Comparison";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Running on standard node environment since we read from local JSON files
export default async function Image({ params }) {
  const slug = params.competitor;
  const dataPath = path.join(process.cwd(), "src", "data", "competitors.json");
  const competitors = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const comp = competitors[slug];

  if (!comp) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#0b0f19",
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>Comparison Page</h1>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0b0f19",
          backgroundImage: "radial-gradient(circle at top left, #1e1b4b 0%, #0b0f19 60%, #020617 100%)",
          color: "#fff",
          padding: "50px 60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top brand header */}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "22px",
                marginRight: "12px",
              }}
            >
              CC
            </div>
            <span style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "-0.5px" }}>CC Bins</span>
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              backgroundColor: "rgba(79, 70, 229, 0.15)",
              border: "1px solid rgba(79, 70, 229, 0.3)",
              fontSize: "14px",
              fontWeight: "600",
              color: "#818cf8",
            }}
          >
            Payment Intelligence Comparison
          </div>
        </div>

        {/* Middle comparison container */}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", margin: "40px 0" }}>
          {/* CC Bins Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "45%",
              backgroundColor: "rgba(17, 24, 39, 0.6)",
              border: "2px solid #4f46e5",
              borderRadius: "20px",
              padding: "24px 30px",
              boxShadow: "0 10px 30px -10px rgba(79, 70, 229, 0.3)",
            }}
          >
            <span style={{ fontSize: "16px", color: "#818cf8", fontWeight: "600", marginBottom: "4px" }}>RECOMMENDED</span>
            <span style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px", color: "#fff" }}>CC Bins</span>
            <div style={{ display: "flex", alignItems: "baseline", marginBottom: "8px" }}>
              <span style={{ fontSize: "40px", fontWeight: "800", color: "#10b981" }}>78ms</span>
              <span style={{ fontSize: "16px", color: "#9ca3af", marginLeft: "6px" }}>avg latency</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#10b981", fontSize: "16px", fontWeight: "600" }}>
              <span style={{ marginRight: "6px" }}>✓</span> 99.99% Edge SLA
            </div>
          </div>

          {/* VS Badge */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#1e1b4b",
              border: "2px solid #312e81",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#818cf8",
              boxShadow: "0 0 20px rgba(79, 70, 229, 0.2)",
            }}
          >
            VS
          </div>

          {/* Competitor Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "45%",
              backgroundColor: "rgba(17, 24, 39, 0.4)",
              border: "1px solid #1f2937",
              borderRadius: "20px",
              padding: "24px 30px",
            }}
          >
            <span style={{ fontSize: "16px", color: "#9ca3af", fontWeight: "600", marginBottom: "4px" }}>ALTERNATIVE</span>
            <span style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "16px", color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {comp.name}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", marginBottom: "8px" }}>
              <span style={{ fontSize: "40px", fontWeight: "800", color: "#ef4444" }}>{comp.competitorLatency || "210ms"}</span>
              <span style={{ fontSize: "16px", color: "#9ca3af", marginLeft: "6px" }}>avg latency</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#ef4444", fontSize: "16px", fontWeight: "600" }}>
              <span style={{ marginRight: "6px" }}>✗</span> {comp.competitorUptime || "N/A"} Uptime SLA
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1f2937", paddingTop: "20px", fontSize: "14px", color: "#9ca3af" }}>
          <div>Daily updates • 600,000+ active ranges • Global CDN</div>
          <div style={{ color: "#818cf8", fontWeight: "600" }}>ccbins.co/compare/{slug}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
