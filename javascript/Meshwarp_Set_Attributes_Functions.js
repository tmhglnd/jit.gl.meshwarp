//-----PUBLIC FUNCTIONS----------------
// if undo or redo contain an arg, then we first check if this meshwarp is active
function undo() {
	if(!arguments.length || checkUndoRedo()) {
		if (!mask_mode) {
			gMesh.undo();
		} else {
			gMesh.maskUndo();
		}
	}
}

function redo() {
	if((!arguments.length || checkUndoRedo())) {
		if (!mask_mode) {
			gMesh.redo();
		} else {
			gMesh.maskRedo();
		}
	} 
}

function time(val)
{	
	gTime.newTime = val;
}

function reset() {
	gGraphics.resetSingleCircle();
	gGraphics.resetSelected();
	if (gMesh != null)
	{		
		gMesh.initMesh(nodeCTX.name, gGraphics.getGraphicsNodeName());
		gMesh.scaleMesh(gMesh.currentScale[0], gMesh.currentScale[1]);
	}
	assignThisAsCurrentlySelectedToGlobal();
	gMaskPix.param("invert", 0);
}

function move_vertex(indexX, indexY, posX, posY) {
	if (gMesh != null)
	{
		var tempPos = [posX, posY]; 
		var tempIndex = [indexX, (gMesh.positionMat.dim[1]-1)-indexY];
		if (checkIfVec2AreDifferent(tempIndex, gMesh.selectedVertexIndex)) {
			var tempPos = gMesh.getPositionMatCell(tempIndex);
		}
		gMesh.moveVertex(tempPos, tempIndex);
	}
}

function reset_mask()
{
	if (gMesh != null)
	{
		gMesh.resetMask();
	}
}

//--------------------------
function jit_gl_texture(texName) {
	setTexturesMeshes(texName);
}

function write(path) {
	debug(DEBUG.GENERAL, "saving to " + path);
	saveDictToPath(path);
}

function read(path) {
	debug(DEBUG.GENERAL, "loading to " + path);
	loadSaveDict(path);
}

function getvalueof() {
	debug(DEBUG.GENERAL, "getvalueof");
	return buildSaveDict(null);
}

function setvalueof(dict) {
	debug(DEBUG.GENERAL, "setvalueof");
	loadFromDict(dict);
}

// ATTRIBUTES ----------------------------------
function setOutputTexture(val)
{
	output_texture = val;
}

function setEnable(val) {
	enable = val;
	videoplane.automatic = val;;
	nodeCTX.automatic = val;
	showUI(val);
	if (gMesh != null)
	{
		gMesh.setEnable(val);
	}
	if(!enable) {
		assignLatestActionToGlobal(GUI_ELEMENTS.NOTHING);
		setToGlobalIfMouseIsOnMesh(false);
	}
}
setEnable.local = 1;

function scaleToTextureRatio() {
	if (gMesh != null)
	{
		gMesh.scaleToTextureRatio();
	}
}
scaleToTextureRatio.local = 1;

function setColor() {
	color = arrayfromargs(arguments);
	if (gMesh != null)
	{
		gMesh.setColor(color);
	}
}
setColor.local = 1;

function setUIGridColor() {
	grid_color = arrayfromargs(arguments);
	if (gMesh != null)
	{
		gMesh.setUIGridColor(grid_color);
	}
}
setUIGridColor.local = 1;

function setSingleCircleColor() {
	gGraphics.setSingleCircleAndFrameColor(arrayfromargs(arguments));
}
setSingleCircleColor.local = 1;

function setMultipleCirclesColor() {
	gGraphics.setMultipleSelectionCirclesColor(arrayfromargs(arguments));
}
setSingleCircleColor.local = 1;

function setCirclesAndFrameLineSize(val) {
	gGraphics.setCirclesAndFrameSize(val);
}

function setRotatez(rotZ) {
	var angleRad = (rotZ / 180) * 3.1459;
	rotatez = rotZ;
	if (gMesh != null)
	{
		gMesh.rotateZ(angleRad);
	}
}
setRotatez.local = 1;

function setBlendEnable(val) {
	blend_enable = val;
	if (gMesh != null)
	{
		gMesh.setBlendEnable(val);
	}
}
setBlendEnable.local = 1;

function setMaskMode(val)
{
	mask_mode = val;
	if (gMesh != null)
	{
		showUI((1-val));
		gMesh.setMaskMode(val);
	}
}
setMaskMode.local = 1;

function setApplyMask(val)
{
	apply_mask = val;
	gMesh.setApplyMask(val);
}
setApplyMask.local = 1;

function setInvertMask(val)
{
	invert_mask = val;
	gMesh.setInvertMask(val);
}
setInvertMask.local = 1;

// SAVE / LOAD -----------------------------------
function buildSaveDict() {
	var saveDict = new Dict();

	saveDict.replace("meshdim", meshdim);
	saveDict.replace("nurbs_order", nurbs_order);
	saveDict.replace("layer", layer);
	saveDict.replace("lock_to_aspect", lock_to_aspect);
	//saveDict.replace("blend_enable", blend_enable);
	saveDict.replace("color", color);	
	saveDict.replace("grid_color", grid_color);
	saveDict.replace("show_ui", show_ui);
	saveDict.replace("point_size", point_size);
	saveDict.replace("grid_size", grid_size);
	// saveDict.replace("output_texture", output_texture);

	saveDict.replace("windowRatio", gWindowRatio);
	
	if (gMesh != null)
	{
		gMesh.saveDataIntoDict(saveDict);
	}
	return saveDict;
}
buildSaveDict.local = 1;

function saveDictToPath(path) {
	var saveDict = buildSaveDict();
	saveDict.export_json(path);
}
saveDictToPath.local = 1;

function loadSaveDict(path) {
	var saveDict = new Dict();
	saveDict.import_json(path);
	
	loadFromDict(saveDict);
}
loadSaveDict.local = 1;

function loadFromDict(saveDict) {
	meshdim = saveDict.get("meshdim");
	nurbs_order = saveDict.get("nurbs_order");
	layer = saveDict.get("layer");
	lock_to_aspect = saveDict.get("lock_to_aspect");
	//blend_enable = saveDict.get("blend_enable");
	color = saveDict.get("color");	
	grid_color = saveDict.get("grid_color");
	show_ui = saveDict.get("show_ui");
	point_size = saveDict.get("point_size");
	grid_size = saveDict.get("grid_size");
	// output_texture = saveDict.get("output_texture");

	gWindowRatio = saveDict.get("windowRatio");

	if (gMesh != null)
	{
		gMesh.loadDict(saveDict); 
	}
	// gMesh.changeMode(mode);
	setTexturesMeshes();
}
loadFromDict.local = 1;

function setScaleRelativeToAspect(val) {
	lock_to_aspect = val;
	if (gMesh != null)
	{
		gMesh.scaleToTextureRatio(val);
	}
}
setScaleRelativeToAspect.local = 1;

function setTexturesMeshes() {
	if (gMesh != null)
	{
		if (arguments.length > 0) {
			texture = (arrayfromargs(arguments));
		}
	
		gMesh.assignTextureToMesh(texture);
	}
}
setTexturesMeshes.local = 1;

function setScale(scaleX, scaleY) {
	if (gMesh != null)
	{
		gMesh.scaleMesh(scaleX, scaleY);
		gMesh.setLatestScale_calcBoundsMat();
	}
}
setScale.local = 1;

function getScale() {
	if (gMesh != null)
	{
		return gMesh.currentScale.slice();
	}
	else 
	{
		return -1;
	}
}
getScale.local = 1;

function setPosition(posX, posY) {
	if (gMesh != null)
	{
		gMesh.setMeshPosition([posX, posY]);
		gMesh.updateGUI();
		gMesh.calcMeshBoundsMat();
	}
}
setPosition.local = 1;

function getPosition() {
	if (gMesh != null)
	{
		return gMesh.currentPos.slice();
	}
	else 
	{
		return -1;
	}
}
getPosition.local = 1;

function setMeshLayer(val) {
	layer = val;
	setVideoplaneLayer(val);
}
setMeshLayer.local = 1;

function setVideoplaneLayer(val) {
	videoplane.layer = val;
	gGraphics.setGraphicsVidPlaneLayer(val+1);
}
setVideoplaneLayer.local = 1;

function setNurbsOrMeshMode(arg) {
	if (arg == 0 || arg == 1) {
		use_nurbs = arg;
		if (gMesh != null)
		{
			gMesh.setNurbsOrMeshMode(use_nurbs);
		}
	}
}
setNurbsOrMeshMode.local = 1;

function setNurbsOrder(x, y) {
	nurbs_order[0] = Math.min(Math.max(x, 1), gMesh.posMatDim[0] - 1);
	nurbs_order[1] = Math.min(Math.max(y, 1), gMesh.posMatDim[1] - 1);
	if (gMesh != null)
	{
		gMesh.changeNurbsOrder(nurbs_order[0], nurbs_order[1]);
	}
}
setNurbsOrder.local = 1;

function setCurvature(curve) {
	curvature = Math.min(Math.max(curve, 0.), 0.9999);
	if (gMesh != null)
	{
		orderx = Math.floor(curvature * gMesh.posMatDim[0]);
		ordery = Math.floor(curvature * gMesh.posMatDim[1]);
		if(nurbs_order[0] != orderx || nurbs_order[1] != ordery) {
			setNurbsOrder(orderx, ordery);
		}
	}
}
setCurvature.local = 1;

function setMeshDim(meshSizeX, meshSizeY) {
	var xSize = Math.max(meshSizeX, 2);
	var ySize = Math.max(meshSizeY, 2);
	meshdim = [xSize, ySize];
	if (gMesh!=null) {
		gMesh.resizeMeshDim([xSize, ySize]);
	}
}
setMeshDim.local = 1;

function showUI(show) {
	show_ui = show;
	if (gMesh!=null && show) {
		assignThisAsCurrentlySelectedToGlobal();
	}
	else if (!show) {
		deselectThisFromGlobal();
		gGraphics.resetSingleCircle();
		gGraphics.resetSelected();
	}
}
showUI.local = 1;

function show_position_handle(val) {
	if (gMesh != null)
	{
		gMesh.showMoveHandle(val);
	}
}

function show_scale_handles(val) {
	if (gMesh != null)
	{
		gMesh.showScaleHandles(val);
	}
}

function setPointSize(size) {
	point_size = size;
	if (gMesh != null)
	{
		gMesh.meshPoints.point_size = point_size;
	}
}
setPointSize.local = 1;

function setGridSize(size) {
	grid_size = size;
	if (gMesh != null)
	{
		gMesh.meshGrid.line_width = grid_size;
		gMesh.meshGrid.enable = (gMesh.showMeshUI && grid_size > 0);
	}
}
setGridSize.local = 1;