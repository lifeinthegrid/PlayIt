<%@ WebService Language="C#" Class="WebServiceExample" %>

using System;
using System.Linq;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Web.Script.Services;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using System.Web.UI.WebControls;
using System.IO;

[WebService(Namespace = "https://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[ScriptService]
public class WebServiceExample  : WebService
{
    [WebMethod]
    public Collection<Section> GetSections()
    {
        Collection<Section> sections = new Collection<Section>();

        Section section = new Section();
        section.id = 1;
        section.name = "My Media";
        sections.Add(section);

        return sections;
    }

    [WebMethod]
    public Collection<Category> GetCategories(object sectionId)
    {
		//Progress Bar Testing
		//System.Threading.Thread.Sleep(5000);

        Collection<Category> categories = new Collection<Category>();

		//MUSIC
        Category category = new Category();
        category.id = "Music";
        category.name = "Music";
        category.type = 2;
        categories.Add(category);

		//IMAGES
        category = new Category();
        category.id = "Pictures";
        category.name = "Pictures";
        category.type = 4;
        categories.Add(category);

		//VIDEOS
		category = new Category();
		category.id = "Videos";
		category.name = "Videos";
		category.type = 3;
		categories.Add(category);

        return categories;
    }

    [WebMethod]
    public Collection<MediaFile> GetMediaFiles(string categoryId)
    {
        Collection<MediaFile> mediaFiles = new Collection<MediaFile>();
		string mediaFileFolder;
		DirectoryInfo dirInfo;
		Image img = new Image();;

        switch (categoryId.ToString())
        {
            case "Music":

				mediaFileFolder = Server.MapPath("~/demo/audio/");
				dirInfo = new DirectoryInfo(mediaFileFolder);
                var mp3s = dirInfo.GetFiles("*.mp3", SearchOption.AllDirectories);

                for (var i = 0; i < mp3s.Length; i++)
                {
                    FileInfo file = mp3s[i];
                    AudioFile audioFile = new AudioFile();
                    audioFile.id = string.Concat(categoryId.ToString(), i);
                    audioFile.title = Path.GetFileNameWithoutExtension(file.FullName);
                    audioFile.fileSize = file.Length;
                    audioFile.src = string.Concat(img.ResolveUrl("~/demo/audio/"), file.FullName.Replace(mediaFileFolder, string.Empty).Replace(@"\", @"/")); // resolve the web path
                    audioFile.album = file.Directory.Name;
                    audioFile.artist = file.Directory.Parent.Name;
                    audioFile.info = file.FullName;
                    audioFile.infoEnable = true;
                    mediaFiles.Add(audioFile);
                }

                break;
            case "Pictures":

				mediaFileFolder = Server.MapPath("~/demo/image/");
				dirInfo = new DirectoryInfo(mediaFileFolder);
                var images = dirInfo.GetFiles("*.jpg", SearchOption.AllDirectories).Where(f => !(f.Name.Contains("thumb"))).ToArray();

                for (var i = 0; i < images.Length; i++)
                {
                    FileInfo file = images[i];
                    MediaFile imageFile = new MediaFile();
                    imageFile.id = string.Concat(categoryId.ToString(), i);
                    imageFile.title = Path.GetFileNameWithoutExtension(file.FullName);
                    imageFile.fileSize = file.Length;
                    imageFile.src = string.Concat(img.ResolveUrl("~/demo/image/"), file.FullName.Replace(mediaFileFolder, string.Empty).Replace(@"\", @"/")); // resolve the web path
                    imageFile.info = file.FullName;
                    imageFile.infoEnable = true;
                    mediaFiles.Add(imageFile);
                }

                break;

			case "Videos":

				mediaFileFolder = Server.MapPath("~/demo/video/");
				dirInfo = new DirectoryInfo(mediaFileFolder);
				var videos = dirInfo.GetFiles("*.mp4", SearchOption.AllDirectories);

				for (var i = 0; i < videos.Length; i++)
				{
					FileInfo file = videos[i];
					MediaFile videoFile = new MediaFile();
					videoFile.id = string.Concat(categoryId.ToString(), i);
					videoFile.title = Path.GetFileNameWithoutExtension(file.FullName);
					videoFile.fileSize = file.Length;
					videoFile.src = string.Concat(img.ResolveUrl("~/demo/video/"), file.FullName.Replace(mediaFileFolder, string.Empty).Replace(@"\", @"/")); // resolve the web path
					videoFile.info = file.FullName;
					videoFile.infoEnable = true;
					mediaFiles.Add(videoFile);
				}

				break;
        }

        return mediaFiles;
    }
}

public class Section
{
    public object id { get; set; }
    public string name { get; set; }
}

public class Category
{
    public object id { get; set; }
    public string name { get; set; }
    public int type { get; set; }
}

public class MediaFile
{
    public object id { get; set; }
    public string title { get; set; }
    public string src { get; set; }
    public long fileSize { get; set; }
    public bool infoEnable { get; set; }
    public string info { get; set; }
}

public class AudioFile : MediaFile
{
    public string album { get; set; }
    public string artist { get; set; }
    public string track { get; set; }
}
