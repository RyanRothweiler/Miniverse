import System.Collections.Generic;
import System.Xml;
import System.IO;
import System.Xml.Serialization;

@XmlRoot("LevelProgress")
public class XmlHandler
{
	
	@XmlArrayAttribute("World")
	@XmlArrayItemAttribute("Level")
	
	public static var sWorld : List.<Level> = new List.<Level>();
	public var World : List.<Level> = new List.<Level>();
	
	public function Save(path : String)
	{
		var serializer : XmlSerializer = new XmlSerializer(XmlHandler);
		var stream : Stream = new FileStream(path, FileMode.Create);
		serializer.Serialize(stream, this);
		stream.Close();
	}

	public static function Load(path : String):XmlHandler
	{
		var serializer : XmlSerializer = new XmlSerializer(XmlHandler);
		var stream : Stream = new FileStream(path, FileMode.Open);
		var result : XmlHandler = serializer.Deserialize(stream) as XmlHandler;
		stream.Close();
		return result;
	}

	
	//public static function Parse(text : String):XmlHandler
	//{
		
	//}

}
/* Usage
	Saving:
	var xmlHandler : XmlHandler = XmlHandler.Save(Path.Combine(Application.persistentDataPath, "lProgress.xml"));

	>>Saves a string to the xml file

	Loading:
	var xmlHandler : XmlHandler = XmlHandler.Load(Path.Combine(Application.persistentDataPath, "lProgress.xml"));

	>Returns a string containing the contents of the xml

	Parse:
	var someArray : XmlHandler = XmlHandler.Parse(xmlHandler);

	>>Produces an Array split up by the "." character
	>>Example might look like 
*/
