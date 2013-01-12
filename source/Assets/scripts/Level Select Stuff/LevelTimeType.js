#pragma strict

//public vars

//private vars

function Start () 
{
	GetComponent(TextMesh).text = Camera.main.GetComponent(LevelTimer).GetBestTime(parseInt(transform.parent.Find("Num").GetComponent(TextMesh).text) - 1).Substring(0,4);
}
	
function Update () 
{
	
}