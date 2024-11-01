const SVGWIDTH = 450;
const SVGHEIGHT = 450;
const xPadding = 20
const yPadding = 15

const margin = {left: 50, right: 50, top:50, bottom:50};
const margin_heat = {top: 20, right: 30, bottom: 30, left: 40};

// default
let outlier_dataset_name = 'data_combination_foxes';
let trajectory_dataset_name = 'fox_trajectories.csv';
let df_with_id = 'fox-df.csv';

let frequency_zone_combinations = {
    "Kinematic Geometric": [],
    "Speed Acceleration": [],
    "Indentation Curvature": [],
    "Curvature Speed": [],
    "Indentation Speed": [],
    "Curvature Acceleration": [],
    "Indentation Acceleration": []  
  };

let file_mapping = {
    "Kinematic Geometric": `../static/${outlier_dataset_name}/Xkinematic_Ygeometric_decision_scores.csv`,
    "Speed Acceleration": `../static/${outlier_dataset_name}/Xspeed_Yacceleration_decision_scores.csv`,
    "Indentation Curvature": `../static/${outlier_dataset_name}/Xindentation_Ycurvature_decision_scores.csv`,
    "Curvature Speed": `../static/${outlier_dataset_name}/Xcurvature_Yspeed_decision_scores.csv`,
    "Indentation Speed": `../static/${outlier_dataset_name}/Xindentation_Yspeed_decision_scores.csv`,
    "Curvature Acceleration": `../static/${outlier_dataset_name}/Xcurvature_Yacceleration_decision_scores.csv`,
    "Indentation Acceleration": `../static/${outlier_dataset_name}/Xindentation_Yacceleration_decision_scores.csv`        
};

function setFileMapping(outlier_dataset_name){
    return {
        "Kinematic Geometric": `../static/${outlier_dataset_name}/Xkinematic_Ygeometric_decision_scores.csv`,
        "Speed Acceleration": `../static/${outlier_dataset_name}/Xspeed_Yacceleration_decision_scores.csv`,
        "Indentation Curvature": `../static/${outlier_dataset_name}/Xindentation_Ycurvature_decision_scores.csv`,
        "Curvature Speed": `../static/${outlier_dataset_name}/Xcurvature_Yspeed_decision_scores.csv`,
        "Indentation Speed": `../static/${outlier_dataset_name}/Xindentation_Yspeed_decision_scores.csv`,
        "Curvature Acceleration": `../static/${outlier_dataset_name}/Xcurvature_Yacceleration_decision_scores.csv`,
        "Indentation Acceleration": `../static/${outlier_dataset_name}/Xindentation_Yacceleration_decision_scores.csv`        
    }
}

let heatmap = new Heatmap('heat-map', 450, 450, margin_heat, frequency_zone_combinations);
heatmap.render(file_mapping);

function selectDataset() {
  document.getElementById("datasets").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

async function selectFoxes(){
    outlier_dataset_name = 'data_combination_foxes';
    trajectory_dataset_name = 'fox_trajectories.csv';
    df_with_id = 'fox-df.csv';
    file_mapping = setFileMapping(outlier_dataset_name)
    heatmap = new Heatmap('heat-map', 450, 450, margin_heat, frequency_zone_combinations);
    await heatmap.render(file_mapping)
}
async function selectHurricanes(){
    outlier_dataset_name = 'data_combination_hurricanes';
    trajectory_dataset_name = 'hurricanes_trajectories.csv';
    df_with_id = 'hurricanes-df.csv';
    file_mapping = setFileMapping(outlier_dataset_name)
    heatmap = new Heatmap('heat-map', 450, 450, margin_heat, frequency_zone_combinations);
    await heatmap.render(file_mapping)
}
async function selectAIS(){
    outlier_dataset_name = 'data_combination_ais';
    trajectory_dataset_name = 'ais_trajectories.csv';
    file_mapping = setFileMapping(outlier_dataset_name)
    heatmap = new Heatmap('heat-map', 450, 450, margin_heat, frequency_zone_combinations);
    await heatmap.render(file_mapping)
}

geometric = ["distance_geometry_1_1","distance_geometry_2_1","distance_geometry_2_2","distance_geometry_3_1","distance_geometry_3_2","distance_geometry_3_3","distance_geometry_4_1","distance_geometry_4_2","distance_geometry_4_3","distance_geometry_4_4","distance_geometry_5_1","distance_geometry_5_2","distance_geometry_5_3","distance_geometry_5_4","distance_geometry_5_5","angles_0s","angles_mean","angles_meanse","angles_quant_min","angles_quant_05","angles_quant_10","angles_quant_25","angles_quant_median","angles_quant_75","angles_quant_90","angles_quant_95","angles_quant_max","angles_range","angles_sd","angles_vcoef","angles_mad","angles_iqr","angles_skew","angles_kurt"]
kinematic = ["speed_0s","speed_mean","speed_meanse","speed_quant_min","speed_quant_05","speed_quant_10","speed_quant_25","speed_quant_median","speed_quant_75","speed_quant_90","speed_quant_95","speed_quant_max","speed_range","speed_sd","speed_vcoef","speed_mad","speed_iqr","speed_skew","speed_kurt","acceleration_0s","acceleration_mean","acceleration_meanse","acceleration_quant_min","acceleration_quant_05","acceleration_quant_10","acceleration_quant_25","acceleration_quant_median","acceleration_quant_75","acceleration_quant_90","acceleration_quant_95","acceleration_quant_max","acceleration_range","acceleration_sd","acceleration_vcoef","acceleration_mad","acceleration_iqr","acceleration_skew","acceleration_kurt"]
