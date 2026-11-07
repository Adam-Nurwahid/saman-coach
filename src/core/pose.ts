import{PoseLandmarker,FilesetResolver}from'@mediapipe/tasks-vision';
const WASM='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm',
MODEL='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';
/** Satu instance per pemakaian (timestamp VIDEO harus monoton per instance). */
export async function createPose(){
  const v=await FilesetResolver.forVisionTasks(WASM);
  const o=(d:'GPU'|'CPU')=>({baseOptions:{modelAssetPath:MODEL,delegate:d},runningMode:'VIDEO' as const,numPoses:1});
  try{return await PoseLandmarker.createFromOptions(v,o('GPU'))}catch{return PoseLandmarker.createFromOptions(v,o('CPU'))}
}
