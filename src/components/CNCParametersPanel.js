import { useControls, folder, Leva } from "leva";
import { useEffect } from "react";
import helpTexts from './helpTexts'; // Import the help texts

export function CNCParametersPanel({ onUpdate, setHelpText, language }) {
  const handleMouseEnter = (label) => setHelpText(`${label}: ${helpTexts[language][label]}`);

  const params = useControls(
    {
      axis_count: {
        value: "3-axis",
        options: ["3-axis", "4-axis", "5-axis"],
        label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Axis Count")}>Axis Count</span>,
      },
      strategy: {
        value: "Profile (Cutout)",
        options: [
          "Profile (Cutout)",
          "Pocket",
          "Drill",
          "Parallel",
          "Cross",
          "Block",
          "Spiral",
          "Circles",
          "Outline Fill",
          "Project Curve to Surface",
          "Waterline - Roughing (Below Z0)",
          "Curve to Path",
          "Medial Axis"
        ],
        label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Strategy")}>Strategy</span>,
      },
      "Operation Setup": folder({
        geometry_source: {
          value: "",
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Geometry Source")}>Geometry Source</span>,
        },
        curve_source: {
          value: "",
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Curve Source")}>Curve Source</span>,
        },
        curve_target: {
          value: "",
          render: (get) => !!get("curve_source"),
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Curve Target")}>Curve Target</span>,
        },
      }),
      "A & B Axes": folder({
        rotation_a: {
          value: 0,
          min: -180,
          max: 180,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("A Axis Rotation")}>A Axis Rotation</span>,
        },
        rotation_b: {
          value: 0,
          min: -180,
          max: 180,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("B Axis Rotation")}>B Axis Rotation</span>,
        },
      }),
      Array: folder({
        x_count: {
          value: 1,
          min: 1,
          max: 10,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("X Count")}>X Count</span>,
        },
        x_distance: {
          value: 10,
          min: 1,
          max: 100,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("X Distance (mm)")}>X Distance (mm)</span>,
        },
        y_count: {
          value: 1,
          min: 1,
          max: 10,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Y Count")}>Y Count</span>,
        },
        y_distance: {
          value: 10,
          min: 1,
          max: 100,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Y Distance (mm)")}>Y Distance (mm)</span>,
        },
      }),
      "Bridges (Tabs)": folder({
        bridges_width: {
          value: 2,
          min: 0.1,
          max: 10,
          step: 0.1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Bridge Width (mm)")}>Bridge Width (mm)</span>,
        },
        bridges_height: {
          value: 0.5,
          min: 0.1,
          max: 10,
          step: 0.1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Bridge Height (mm)")}>Bridge Height (mm)</span>,
        },
        use_modifiers: {
          value: false,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Use Modifiers")}>Use Modifiers</span>,
        },
      }),
      "Operation Area": folder({
        operation_depth_start: {
          value: 0,
          min: 0,
          max: 50,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Start Depth (mm)")}>Start Depth (mm)</span>,
        },
        operation_depth_max: {
          value: 2,
          min: 1,
          max: 50,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Max Depth (mm)")}>Max Depth (mm)</span>,
        },
        first_down: {
          value: false,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("First Down")}>First Down</span>,
        },
      }),
      Cutter: folder({
        cutter_type: {
          value: "End",
          options: ["End", "Ball", "Bull"],
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Cutter Type")}>Cutter Type</span>,
        },
        cutter_diameter: {
          value: 3,
          min: 1,
          max: 20,
          step: 0.1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Cutter Diameter (mm)")}>Cutter Diameter (mm)</span>,
        },
        cutter_flutes: {
          value: 2,
          min: 1,
          max: 10,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Flutes")}>Flutes</span>,
        },
        cutter_id: {
          value: 1,
          min: 1,
          max: 100,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Tool Number")}>Tool Number</span>,
        },
        cutter_description: { value: "", label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Description")}>Description</span> },
      }),
      Feedrate: folder({
        feedrate: {
          value: 1000,
          min: 100,
          max: 3000,
          step: 50,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Feedrate (mm/min)")}>Feedrate (mm/min)</span>,
        },
        spindle_rpm: {
          value: 12000,
          min: 1000,
          max: 24000,
          step: 500,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Spindle Speed (RPM)")}>Spindle Speed (RPM)</span>,
        },
        plunge_feedrate: {
          value: 50,
          min: 10,
          max: 100,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Plunge Speed (%)")}>Plunge Speed (%)</span>,
        },
        plunge_angle: {
          value: 30,
          min: 0,
          max: 90,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Plunge Angle (°)")}>Plunge Angle (°)</span>,
        },
      }),
      Movement: folder({
        milling_type: {
          value: "Climb (Down)",
          options: ["Climb (Down)", "Conventional (Up)"],
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Milling Type")}>Milling Type</span>,
        },
        spindle_rotation: {
          value: "Clockwise",
          options: ["Clockwise", "Counter-Clockwise"],
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Cutter Spin")}>Cutter Spin</span>,
        },
        protect_vertical: {
          value: false,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Protect Vertical")}>Protect Vertical</span>,
        },
        angle_limit: {
          value: 4,
          min: 0,
          max: 90,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Angle Limit (°)")}>Angle Limit (°)</span>,
        },
      }),
      Optimisation: folder({
        detail_size: {
          value: 0.1,
          min: 0.01,
          max: 1,
          step: 0.01,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Detail Size (mm)")}>Detail Size (mm)</span>,
        },
        max_res: {
          value: 16,
          min: 1,
          max: 64,
          step: 1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Max Resolution (MP)")}>Max Resolution (MP)</span>,
        },
        reduce_path_points: {
          value: true,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Reduce Path Points")}>Reduce Path Points</span>,
        },
        optimize_threshold: {
          value: 0.2,
          min: 0.01,
          max: 1,
          step: 0.01,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Threshold (μm)")}>Threshold (μm)</span>,
        },
      }),
      "G-Code": folder({
        output_header: {
          value: false,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Output Header")}>Output Header</span>,
        },
        output_trailer: {
          value: false,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Output Trailer")}>Output Trailer</span>,
        },
        enable_dust: {
          value: false,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Enable Dust Collector")}>Enable Dust Collector</span>,
        },
        enable_mist: {
          value: false,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Enable Mist Cooling")}>Enable Mist Cooling</span>,
        },
      }),
    },
  );

  useEffect(() => {
    onUpdate(params);
  }, [params, onUpdate]);

  return (
    <div>
      <Leva oneLineLabels fill />
    </div>
  );
}