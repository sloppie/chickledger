package com.chickledger.utilities;

// android packages
import android.widget.Toast;

// react native packages
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

// java packages
import java.util.Map;
import java.util.HashMap;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.FileNotFoundException;

public class FileManager extends ReactContextBaseJavaModule implements DataQuery {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";
  private final File filesDir = getReactApplicationContext().getFilesDir();

  public FileManager(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "FileManager";
  }

  @ReactMethod
  public void create(String context, String data, Callback state) {
    boolean check = DirectoryCheck.makeDirectories(filesDir, context);
    if(check) {
      createBrief(context, data);
      state.invoke(true, false);
    } else {
      state.invoke(false, true);
    }
  } 

  private void createBrief(String context, String data) {
    File brief = new File(filesDir, "data/" + context + "/brief");
    writeFile(brief, data);
  }

  // One method provided to the context then afterwards adds the data to the respective key of the data
  @ReactMethod
  public void addData(String context, String key, String data) {
      writeFile(getDir(context, key), data);
      makeToast("data added to " + key + " store");
  }

  // fetching the data
  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean batchExists(String context) {
    return new File(filesDir, "data/" + context).exists();
  }

  @ReactMethod
  public void fetchBatches(Callback response) {
    String data = "{";
    File dataFolder = new File(filesDir, "data");
    File[] files = dataFolder.listFiles();
    if(files != null) {
      int length = files.length;
      for(int i=0; i<(length - 1); i++) {
        String brief = fetchBrif(files[i].getName());
        data += "\"" + files[i].getName() + "\"" + ": " ;
        data += brief + ",";
      }
      String brief = fetchBrif(files[(length - 1)].getName());
      data += "\"" + files[(length - 1)].getName() + "\"" + ": " ;
      data += brief;
    }

    data += "}";

    response.invoke(data);
  }

  @ReactMethod
  public void fetchBrief(String context, Callback data) {
    String contents = fetchBrif(context);
    data.invoke(contents);
  }

  private String fetchBrif(String context) {
    File brief = new File(filesDir, "data/" + context + "/brief");
    String contents = readFile(brief);

    return contents;
  }

  @ReactMethod
  public void fetchData(String context, String key, Callback data) {
    data.invoke(readFile(getDir(context, key)));
  }

  // get write directory
  private File getDir(String context, String key) {
    File dataFile = new File(filesDir, "data/" + context + "/" + key);

    if(!dataFile.exists()) {      
      try {
        dataFile.createNewFile();
      } catch (Exception e) {
        // pass
      }
    }
    return dataFile;
  }


  private void makeToast(String message) {
    Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
  }

  // Helper function for reading files
  private String readFile(File file) {

    String data = "";

    try {
      int c;

      FileReader fileRead = new FileReader((file));
      while ((c = fileRead.read()) != -1) {
        data += (char) c;
      }

      fileRead.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
    return data;
  }

  // Helper function for writing to files
  private void writeFile(File file, String data) {
    if (file.exists()) {
      try {
        FileWriter fileWrite = new FileWriter(file);

        fileWrite.write(data);
        fileWrite.flush();
        fileWrite.close();
      } catch (IOException ioe) {
        ioe.printStackTrace();
      }
      makeToast(file.getAbsolutePath());
    } else {
      try {
        file.createNewFile();

        FileWriter fileWrite = new FileWriter(file);

        fileWrite.write(data);
        fileWrite.flush();
        fileWrite.close();
      makeToast(file.getAbsolutePath());
      } catch (IOException ioe) {
        ioe.printStackTrace();
      }
    }
  }

  // Helper function to send events
  private void sendFile(ReactContext reactContext, String eventName, WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }
}
