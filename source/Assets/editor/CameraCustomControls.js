
@CustomEditor(DragControlsPC)

class CameraCustomControls extends Editor
{
    function OnInspectorGUI () 
    {	
        if(GUILayout.Button("Set ZoomOutPos"))
        {
            Camera.main.GetComponent(DragControlsPC).CameraZoomOutPos = Camera.main.transform.position;
            EditorUtility.SetDirty(target);
        }
        
        DrawDefaultInspector ();
    }
}