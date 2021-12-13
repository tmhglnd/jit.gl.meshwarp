// JIT_GL_NODE
var nodeCTX = new JitterObject("jit.gl.node");
nodeCTX.capture = 1;
nodeCTX.automatic = 1;
nodeCTX.adapt = 1;
nodeCTX.erase_color = [0, 0, 0, 0];
nodeCTX.fsaa = 1;

// OBJECTS INSTANCES USED GLOBALLY 
var gGraphics = new GraphicElements(nodeCTX.name);
var gMinMaxMat = new JitterObject("jit.3m");

// VIDEOPLANE
var videoplane = new JitterObject("jit.gl.videoplane");
videoplane.transform_reset = 2;
videoplane.color = WHITE;
videoplane.color[3] = 0;
videoplane.texture = nodeCTX.out_name;
videoplane.depth_enable = 0;
videoplane.blend_enable = 1;
videoplane.layer = layer;

// CAMERA IN NODE
var nodeCamera = new JitterObject("jit.gl.camera");
nodeCamera.drawto = nodeCTX.name;
nodeCamera.ortho = 2;

//---------------------------------------------------------------

// function calculateBoundingCells(selectionStruct) {
// 	if (selectionStruct.cellIndex[0] != -1 && (selectionStruct.cellIndex[0] != selectionStruct.oldCellIndex[0] || 
// 		selectionStruct.cellIndex[1] != selectionStruct.oldCellIndex[1])) {
// 		selectionStruct.oldCellIndex = selectionStruct.cellIndex.slice();
// 		if (selectionStruct.cellIndex[0] != GUI_ELEMENTS.MOVE_HANDLE) { // if it's a handle don't recalculate ajiacent cells mat
// 			gMesh.calcAdjacentCellsMat(selectionStruct.cellIndex.slice());
// 		}
// 	}
// }
// calculateBoundingCells.local = 1;

function setWindowRatio(dims) {
	gWindowRatio = dims[0] / dims[1];
} 
setWindowRatio.local = 1;

function notifydeleted() {
	debug(DEBUG.GENERAL, "freebang");
	removeFromGlobalCtxMap(); // remove from global meshwarp array
	gMesh.freeMesh();
	gGraphics.free();
	nodeCTX.freepeer();
	videoplane.freepeer();
	nodeCamera.freepeer();
	implicit_lstnr.subjectname = ""
	implicit_tracker.freepeer();
	// what else?
}

function setNodeDrawto() {
	nodeCTX.drawto = drawto;
	videoplane.drawto = drawto;	
}
setNodeDrawto.local = 1;

function checkModifiersKeyDown() {
	if (gShiftPressed != max.shiftkeydown) {
		gShiftPressed = max.shiftkeydown;
		gMesh.setMeshRatio();
	}
	gCTRLPressed = max.cmdkeydown;
}
checkModifiersKeyDown.local = 1;

function checkUndoRedo() {
	if (gIsMouseInsideWindow && gMesh.showMeshUI) {
		gGraphics.resetSelected();
		return true;
	}
	return false;
}
checkUndoRedo.local = 1;

function validTexture(texArray) {
	return (texArray && texArray.length && texArray[0] != "")
}
validTexture.local = 1;