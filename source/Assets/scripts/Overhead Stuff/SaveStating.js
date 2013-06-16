#pragma strict

//Save Stater Class
public class SaveStating
{

//public var n : String;
//public var b : int;
//public var l : boolean;
//public var curLevel : Level;
//public var curWorld : World;
//var xmlHandler : XmlHandler = new XmlHandler();
//
//	public function SS()
//	{
//		//Create new Level object
//		curLevel = new Level();
//	
//		//Set the level name to n, or the name of the current level given by DragControlsPC
//  		curLevel.name = n;
//  	
//  		//Set the time of completion for the level to b given by DragControlsPC
//  		curLevel.bTime = b;
//  	
//  		//Set the progress of the level between complete or not (True or False) given by DragControlsPC
//  		curLevel.lProgress = l;
//  	
//  		//For every Level object in the xmlHandler.sWorld List
//   		for(var level : Level in xmlHandler.sWorld)
//   		{
//   	
//   			//Check to see if the currentLevel is the same as a level in the list
//    		if(curLevel.name == level.name)
//    		{
//    	
//    			//If there is a matching level, check if the time of completion of the currentl level is less than the time stored
//     			if(curLevel.bTime <= level.bTime)
//     			{
//     		
//     				//Remove the level in the list and trim the list's length down.
//      				xmlHandler.sWorld.Remove(level);
//      				xmlHandler.sWorld.TrimExcess();
//     			}
//     			else
//     			{
//     		
//     				//If the time of the level in the list is better than the current one, set the curLevel to null
//      				curLevel = null;
//     			}
//    		}
//   		}
//   
//		//If curLevel is null then nothing is done.
//		if(curLevel == null)
//		{
//			print("nothing done");
//		}
//   
//		//Otherwise, the current level is added to the list
//		else
//		{
//			xmlHandler.sWorld.Add(curLevel);
//		}
//   
//		//Making sure everything is properly reset
//		n = "";
//  		b = 0;
//  		l = false;
//	}
}