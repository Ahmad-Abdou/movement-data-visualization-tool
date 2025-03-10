let current_selected_combination = null
let current_selected_zone = null
let current_selectec_data = null
let selectedTrajectory1 = null
let selectedTrajectory2 = null
let globalXAxis = null
let globalYAxis = null

const kinematicColor = '#0080FF80'
const geometricColor = '#DC143C80'
let selectingTrajectoryOne = false
let selectingTrajectoryTwo = false

window.numOfZones = 0

// default
let outlier_dataset_name = 'data_combination_foxes';
let trajectory_dataset_name = 'fox_trajectories.csv';
let df_with_id = 'fox-df.csv';
current_selectec_data = outlier_dataset_name
let currentSelectedId = null
let frequency_zone_combinations = {
    "Geometric Kinematic": [],
    "Acceleration Speed": [],
    "Curvature Indentation": [],
    "Curvature Speed": [],
    "Indentation Speed": [],
    "Acceleration Curvature": [],
    "Acceleration Indentation": [] 
  };

let file_mapping = {
    "Geometric Kinematic": `../static/${outlier_dataset_name}/Xkinematic_Ygeometric_decision_scores.csv`,
    "Acceleration Speed": `../static/${outlier_dataset_name}/Xspeed_Yacceleration_decision_scores.csv`,
    "Curvature Indentation": `../static/${outlier_dataset_name}/Xindentation_Ycurvature_decision_scores.csv`,
    "Curvature Speed": `../static/${outlier_dataset_name}/Xcurvature_Yspeed_decision_scores.csv`,
    "Indentation Speed": `../static/${outlier_dataset_name}/Xindentation_Yspeed_decision_scores.csv`,
    "Acceleration Curvature": `../static/${outlier_dataset_name}/Xcurvature_Yacceleration_decision_scores.csv`,
    "Acceleration Indentation": `../static/${outlier_dataset_name}/Xindentation_Yacceleration_decision_scores.csv`      
};

function setFileMapping(outlier_dataset_name){
    return {
        "Geometric Kinematic": `../static/${outlier_dataset_name}/Xkinematic_Ygeometric_decision_scores.csv`,
        "Acceleration Speed": `../static/${outlier_dataset_name}/Xspeed_Yacceleration_decision_scores.csv`,
        "Curvature Indentation": `../static/${outlier_dataset_name}/Xindentation_Ycurvature_decision_scores.csv`,
        "Curvature Speed": `../static/${outlier_dataset_name}/Xcurvature_Yspeed_decision_scores.csv`,
        "Indentation Speed": `../static/${outlier_dataset_name}/Xindentation_Yspeed_decision_scores.csv`,
        "Acceleration Curvature": `../static/${outlier_dataset_name}/Xcurvature_Yacceleration_decision_scores.csv`,
        "Acceleration Indentation": `../static/${outlier_dataset_name}/Xindentation_Yacceleration_decision_scores.csv`      
    }
}
file_mapping = setFileMapping(outlier_dataset_name)


function selectDataset() {
  document.getElementById("datasets").classList.toggle("show");
}

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
    try {
        const response = await fetch('/api/trajectories');
        const result = await response.json();
        if (response.status === 200) {
            outlier_dataset_name = 'data_combination_foxes';
            trajectory_dataset_name = 'fox_trajectories.csv';
            df_with_id = 'fox-df.csv';
            file_mapping = setFileMapping(outlier_dataset_name);
            heatmap.render(file_mapping);
            current_selectec_data = outlier_dataset_name;
        } else {
            console.error('Failed to fetch fox data');
        }
    } catch (error) {
        console.error('Error fetching fox data:', error);
    }
}
async function selectHurricanes(){
    outlier_dataset_name = 'data_combination_hurricanes';
    trajectory_dataset_name = 'hurricanes_trajectories.csv';
    df_with_id = 'hurricanes-df.csv';
    file_mapping = setFileMapping(outlier_dataset_name)
    heatmap.render(file_mapping)
    current_selectec_data = outlier_dataset_name

}
async function selectAIS(){
    outlier_dataset_name = 'data_combination_ais';
    trajectory_dataset_name = 'ais_trajectories.csv';
    file_mapping = setFileMapping(outlier_dataset_name)
    heatmap.render(file_mapping)
    current_selectec_data = outlier_dataset_name

}

function getCurrentDatasetFolder() {

    switch(outlier_dataset_name) {
        case 'data_combination_foxes':
            return 'foxes';
        case 'data_combination_hurricanes':
            return 'hurricanes';
        case 'data_combination_ais':
            return 'ais';
        default:
            return 'fox_trajectories';
    }
}

let file_mapping2 = {
    "data_combination_foxes": `../static/data/df_foxes_with_ID.csv`, 
    "data_combination_hurricanes": `../static/data/df_cyclones_with_ID.csv`, 
    "data_combination_ais": `../static/data/df_ais_with_ID.csv`, 
};

geometric = ["distance_geometry_1_1","distance_geometry_2_1","distance_geometry_2_2","distance_geometry_3_1","distance_geometry_3_2","distance_geometry_3_3","distance_geometry_4_1","distance_geometry_4_2","distance_geometry_4_3","distance_geometry_4_4","distance_geometry_5_1","distance_geometry_5_2","distance_geometry_5_3","distance_geometry_5_4","distance_geometry_5_5","angles_0s","angles_mean","angles_meanse","angles_quant_min","angles_quant_05","angles_quant_10","angles_quant_25","angles_quant_median","angles_quant_75","angles_quant_90","angles_quant_95","angles_quant_max","angles_range","angles_sd","angles_vcoef","angles_mad","angles_iqr","angles_skew","angles_kurt"]
kinematic = ["speed_0s","speed_mean","speed_meanse","speed_quant_min","speed_quant_05","speed_quant_10","speed_quant_25","speed_quant_median","speed_quant_75","speed_quant_90","speed_quant_95","speed_quant_max","speed_range","speed_sd","speed_vcoef","speed_mad","speed_iqr","speed_skew","speed_kurt","acceleration_0s","acceleration_mean","acceleration_meanse","acceleration_quant_min","acceleration_quant_05","acceleration_quant_10","acceleration_quant_25","acceleration_quant_median","acceleration_quant_75","acceleration_quant_90","acceleration_quant_95","acceleration_quant_max","acceleration_range","acceleration_sd","acceleration_vcoef","acceleration_mad","acceleration_iqr","acceleration_skew","acceleration_kurt"]


const xPadding = 20
const yPadding = 15

const margin = {left: 50, right: 50, top:50, bottom:65};


geometric = ["distance_geometry_1_1","distance_geometry_2_1","distance_geometry_2_2","distance_geometry_3_1","distance_geometry_3_2","distance_geometry_3_3","distance_geometry_4_1","distance_geometry_4_2","distance_geometry_4_3","distance_geometry_4_4","distance_geometry_5_1","distance_geometry_5_2","distance_geometry_5_3","distance_geometry_5_4","distance_geometry_5_5","angles_0s","angles_mean","angles_meanse","angles_quant_min","angles_quant_05","angles_quant_10","angles_quant_25","angles_quant_median","angles_quant_75","angles_quant_90","angles_quant_95","angles_quant_max","angles_range","angles_sd","angles_vcoef","angles_mad","angles_iqr","angles_skew","angles_kurt"]
kinematic = ["speed_0s","speed_mean","speed_meanse","speed_quant_min","speed_quant_05","speed_quant_10","speed_quant_25","speed_quant_median","speed_quant_75","speed_quant_90","speed_quant_95","speed_quant_max","speed_range","speed_sd","speed_vcoef","speed_mad","speed_iqr","speed_skew","speed_kurt","acceleration_0s","acceleration_mean","acceleration_meanse","acceleration_quant_min","acceleration_quant_05","acceleration_quant_10","acceleration_quant_25","acceleration_quant_median","acceleration_quant_75","acceleration_quant_90","acceleration_quant_95","acceleration_quant_max","acceleration_range","acceleration_sd","acceleration_vcoef","acceleration_mad","acceleration_iqr","acceleration_skew","acceleration_kurt"]

async function sendDataToPython(path_combination, zoneA, zoneB ,df_path_with_id) {
    try {
        const cleanPath = path => path.replace('../static/', '');
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                path_combination: cleanPath(path_combination),
                zoneA: parseInt(zoneA),
                zoneB: parseInt(zoneB),
                df_path_with_id: cleanPath(df_path_with_id),
                x_axis: globalXAxis,
                y_axis: globalYAxis
            })
        });
        // if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        // }
        
        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error sending data to Python:', error);
        throw error;
    }
}

function displayFeatureImportance(data) {
    const { feature_importance, accuracy, f1_score } = data;
    let container = document.querySelector('.feature-importance-container');
    if (!container) return;
    
    container.innerHTML = ''
    const accuracy_p  = document.createElement('p')
    const f1_score_p  = document.createElement('p')
    accuracy_p.innerHTML = `Model Accuracy: ${(accuracy * 100).toFixed(2)}`
    f1_score_p.innerHTML = `F1- Score: ${(f1_score * 100).toFixed(2)}`
    container.appendChild(accuracy_p)
    container.appendChild(f1_score_p)
    const featureBar = new FeatureBar('.feature-importance-container', 600, 400,feature_importance)
    featureBar.render()
}

resultasdas = []
function displayselectedZone() {
    let selector = document.getElementById("zone-select-1")
    let selector2 = document.getElementById("zone-select-2")
    let zoneA = null;
    let zoneB = null;
    selector.addEventListener('change', async (e) => {
        zoneA = parseInt(e.target.value);

        Array.from(selector2.options).forEach((option) => {
            option.disabled = false
        })

        Array.from(selector2.options).forEach((option) => {
            if (parseInt(option.value) === zoneA) {
                option.disabled = true
            }
        })
        await axesPlot.colorZone1(zoneA, frequency_zone_combinations)
    });
    selector2.addEventListener('change', async (e) => {
        zoneB = parseInt(e.target.value);

        Array.from(selector.options).forEach((option) => {
            option.disabled = false
        })

        Array.from(selector.options).forEach((option) => {
            if (parseInt(option.value) === zoneB) {
                option.disabled = true
            }
        })
        await axesPlot.colorZone2(zoneB, frequency_zone_combinations)
        if (zoneA !== undefined && zoneB !== undefined && current_selected_combination ) {
            try {
                const result = await sendDataToPython(
                    file_mapping[current_selected_combination], 
                    zoneA,
                    zoneB,
                    file_mapping2[current_selectec_data]
                );
                if (result.status === 'success') {
                    const right_container = document.getElementById('right-container')
                    right_container.style.transform = 'translate(0px, 0)'

                    displayFeatureImportance(result.data);
                    axesPlot.svg.selectAll('circle')
                    .attr('fill', function(d) {
                        const x = d.normalizedX;
                        const y = d.normalizedY;
                        const pointZone = getZoneForPoint(x, y);
                        return pointZone === zoneB ? geometricColor : 'grey';
                    });
                }
            } catch (error) {
                console.error('Failed to process data:', error);
            }
        }
    });
}


function getZoneForPoint(x, y) {
    if (x < 0.5 && y < 0.5) {
        return 0;
    } else if (x < 0.5 && y > 0.5 && x < (y - 0.5)) {
        return 1;
    } else if (x > 0.5 && y < (x - 0.5)) {
        return 2;
    } else {
        return 3;
    }
}

function notifyMessage (text) {
    notification.textContent = text
    notification.style.transform = 'translate(0, 50px)'
    setTimeout(() => {
      notification.style.transform = 'translate(0, -290px)'
      }, 2000)
  }

  function notifyMessageAlwaysdisplayed (text, isTrue) {
    if(isTrue) {
        notification.textContent = text
        notification.style.transform = 'translate(0, 50px)'
    }
    else {
        notification.style.transform = 'translate(0, -290px)'
    }
  }