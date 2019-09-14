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

// !TODO write a helper function that is a template for what a "batch" folder should look like
// !TODO write a helper function for 'brief' file template maker 
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
  public void create(String batchName, String data) {
    if (DirectoryCheck.checkDirectory(filesDir)) {
      makeToast("Data Directory exists... Making ");
      if (DirectoryCheck.makeDirectories(filesDir, batchName)) {
        makeToast(batchName + " ready for use");
      } else {
        makeToast("Data does not exist... making both directories");
        DirectoryCheck.makeDirectories(filesDir, batchName);
        File batch = new File(filesDir, "data/" + batchName);
        makeToast(batch.getAbsolutePath() + " ready for use at");
      }
    } else {
      makeToast("Data does not exist... making both directories");
      DirectoryCheck.makeDirectories(filesDir, batchName);
      // makeToast(batchName + "ready for use");
    }

    try {
      File brief = new File(filesDir, "data/" + batchName + "/brief");

      writeFile(brief, data);

      makeToast(brief.getAbsolutePath());
    } catch (Exception e) {
      e.printStackTrace();
    }

  }

  @ReactMethod
  public void addWeek(String context, int weekNumber) {
    File week = new File(filesDir, "data/" + context + "/" + stringifyWeekNumber(weekNumber));

    if (week.exists()) {
      makeToast("Week already exists");
    } else {
      try {
        week.createNewFile();
        makeToast("Week " + weekNumber + " added");
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  @ReactMethod
  public void addDay(String context, int weekNumber, String data) {
    File day = new File(filesDir, "data/" + context + "/" + stringifyWeekNumber(weekNumber));
    if (day.exists()) {
      // rewrites the whole json string into the file with the updated key for the day
      writeFile(day, data);
      makeToast(weekNumber + " added to data stored");
    } else {
      try {
        day.createNewFile();
        writeFile(day, data);
        makeToast(weekNumber + " added to data stored");
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }

  @ReactMethod
  public void fetchBatches(Callback onSuccess){
    try{
      File data = new File(filesDir, "data");
      makeToast(data.getAbsolutePath());
      String batches = "{";
      int i = 1;
      File[] foundFiles = data.listFiles();
      int max = foundFiles.length - 1;
      for(int x=0; x<foundFiles.length; x++){
        if(x<max){
          batches += "\"" + i  + "\"" + ": " + fetchBrief(foundFiles[x].getName()) + ",";
        }else{
          batches += "\"" + i  + "\"" + ": " + fetchBrief(foundFiles[x].getName());
        }
        
        i++;
      }

      batches += "}";
      onSuccess.invoke(batches);
    }catch(Exception e){
      e.printStackTrace();
      onSuccess.invoke("{\"1\":\"No Success\"}");
    }
  }

  
  public String fetchBrief(String context){
    File batch = new File(filesDir, "data/" + context + "/brief");
    return readFile(batch);
  }

  @ReactMethod
  public void writeBrief(String context, String data, Callback response){
    File brief = new File(filesDir, "data/" + context + "/brief");
    if(brief.exists()){
      writeFile(brief, data);
    }
  }

  private void makeToast(String message) {
    Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
  }

  @ReactMethod
  public void fetchWeek(String context, int weekNumber, Callback sendData) {
    File week = new File(filesDir, "data/" + context + "/" + stringifyWeekNumber(weekNumber));

    sendData.invoke(readFile(week));
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String fetchWeeker(String context, int weekNumber){
    File week = new File(filesDir, "data/" + context + "/" + stringifyWeekNumber(weekNumber));

    return readFile(week);
  }

  @ReactMethod
  public void fetchBatch(String context, Callback onError) {
    if (DirectoryCheck.checkDirectory(filesDir, context)) {
      File contextLocation = new File(filesDir, "data/" + context);

      for (File file : contextLocation.listFiles()) {
        Thread readFile = new Thread(new ThreadRunner(file, (ReactContext) getReactApplicationContext()));
        readFile.start();
      }

    } else {
      onError.invoke("Error recovering files");
    }
  }

  @ReactMethod
  public void addToBatch(String context, int weekNumber, String data, Callback onSuccess) {
    if (DirectoryCheck.checkDirectory(filesDir, context)) {
      File week = new File(filesDir, "data/" + context + "/" + weekNumber);
      if (week.exists()) {
        writeFile(week, data);
        // !TODO refactor the callback to display a better message
        onSuccess.invoke("success");
      } else {
        try {
          week.createNewFile();
          writeFile(week, data);
          onSuccess.invoke("success");
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  private String stringifyWeekNumber(int weekNumber) {
    if (weekNumber < 10) {
      return "0" + weekNumber + "";
    } else {
      return "" + weekNumber + "";
    }
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
    } else {
      try {
        file.createNewFile();

        FileWriter fileWrite = new FileWriter(file);

        fileWrite.write(data);
        fileWrite.flush();
        fileWrite.close();
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
