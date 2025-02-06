import { useControls, folder, Leva, button } from "leva"; // Import button
import { useEffect, useState } from "react";
import helpTexts from './helpTexts'; // Import the help texts

const strategyParameters = [
  {
    label: "Type",
    variable: "pocket_type",
    type: "EnumProperty",
    options: ["Option1", "Option2"], // Add options
    strategies: ["Pocket"]
  },
  {
    label: "Start Point",
    variable: "start_point",
    type: "EnumProperty",
    options: ["Option1", "Option2"], // Add options
    strategies: ["Profile (Cutout)", "Pocket"]
  },
  {
    label: "Cut",
    variable: "cut",
    type: "EnumProperty",
    options: ["Outside", "Inside", "On Line"],
    strategies: ["Profile (Cutout)"]
  },
  {
    label: "Skin",
    variable: "cutout_skin",
    type: "FloatProperty",
    strategies: ["Profile (Cutout)", "Pocket", "Parallel", "Cross", "Carve", "Waterline"]
  },
  {
    label: "Overshoot",
    variable: "enable_overshoot",
    type: "BoolProperty",
    strategies: ["Profile (Cutout)", "Pocket"]
  },
  {
    label: "Toolpath Distance Between",
    variable: "toolpath_spacing",
    type: "FloatProperty",
    strategies: ["Pocket", "Parallel", "Cross", "Block", "Spiral", "Circles", "Outline Fill", "Waterline"]
  },
  {
    label: "Holes On",
    variable: "drill_hole_position",
    type: "EnumProperty",
    options: ["Option1", "Option2"], // Add options
    strategies: ["Drill"]
  },
  {
    label: "Inverse Milling",
    variable: "inverse_milling",
    type: "BoolProperty",
    strategies: ["Parallel", "Cross", "Block", "Spiral", "Circles", "Outline Fill"]
  },
  {
    label: "Angle of Paths",
    variable: "path_angle",
    type: "FloatProperty",
    strategies: ["Parallel", "Cross"]
  },
  {
    label: "Depth",
    variable: "carve_depth",
    type: "FloatProperty",
    strategies: ["Carve"]
  },
  {
    label: "Slice Detail",
    variable: "waterline_slice_detail",
    type: "FloatProperty",
    strategies: ["Waterline"]
  },
  {
    label: "Outlines Count",
    variable: "outline_count",
    type: "IntProperty",
    strategies: ["Profile (Cutout)", "Curve to Path"]
  },
  {
    label: "Don't Merge",
    variable: "disable_merge",
    type: "BoolProperty",
    strategies: ["Profile (Cutout)", "Curve to Path"]
  },
  {
    label: "Threshold",
    variable: "medial_axis_threshold",
    type: "FloatProperty",
    strategies: ["Medial Axis"]
  },
  {
    label: "Detail Size",
    variable: "medial_axis_detail_size",
    type: "FloatProperty",
    strategies: ["Medial Axis"]
  },
  {
    label: "Add Pocket",
    variable: "enable_medial_pocket",
    type: "BoolProperty",
    strategies: ["Medial Axis"]
  },
  {
    label: "Add Medial Mesh",
    variable: "enable_medial_mesh",
    type: "BoolProperty",
    strategies: ["Medial Axis"]
  }
];

export function CNCParametersPanel({ onUpdate, setHelpText, language }) {
  const [dynamicOptions, setDynamicOptions] = useState({
    axis_count: ["3-axis", "4-axis", "5-axis"],
    strategy: [
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
    ]
  });

  const handleMouseEnter = (label) => setHelpText(`${label}: ${helpTexts[language][label]}`);

  const params = useControls(
    {
      axis_count: {
        value: "3-axis",
        options: dynamicOptions.axis_count,
        label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Axis Count")}>Axis Count</span>,
      },
      strategy: {
        value: "Profile (Cutout)",
        options: dynamicOptions.strategy,
        label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Strategy")}>Strategy</span>,
      },
      "Operation Setup": folder({
        ...strategyParameters.reduce((acc, param) => {
          acc[param.variable] = {
            value: param.type === "BoolProperty" ? false : param.type === "FloatProperty" ? 0 : param.type === "EnumProperty" ? param.options[0] : "",
            options: param.options,
            label: <span className="leva__label" onMouseEnter={() => handleMouseEnter(param.label)}>{param.label}</span>,
            render: (get) => param.strategies.includes(get("strategy"))
          };
          return acc;
        }, {})
      }),
      Material: folder({
        z_placement: {
          value: "Below",
          options: ["Below", "Above", "Centered"],
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Z Placement")}>Z Placement</span>,
        },
        x_position: {
          value: 0,
          min: -10,
          max: 10,
          step: 0.1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("X Position")}>X Position</span>,
        },
        y_position: {
          value: 0,
          min: -10,
          max: 10,
          step: 0.1,
          label: <span className="leva__label" onMouseEnter={() => handleMouseEnter("Y Position")}>Y Position</span>,
        },
/*         position_object: button(() => {
          // Add your positioning logic here
          console.log("Position Object button clicked");
        }), */
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
    [dynamicOptions] // Dependency array to refresh the input schema
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