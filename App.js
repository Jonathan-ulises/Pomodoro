import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
// Componentes nativos de reac-native (usa los mismos nativos que android / ios)
// Platform nos ayuda a identificar la plataforma en la cual se esta corriendo la app
import { 
  StyleSheet, 
  Platform, 
  Text, 
  View, 
  Button, 
  SafeAreaView, 
  TouchableOpacity
} from 'react-native';

import { Audio } from "expo-av";

import Header from './src/components/Header';
import Timer from './src/components/Timer';


const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"]

export default function App() {

  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK")
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      // run timer
      interval = setInterval(() => {
        setTime(time - 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }

    if (time === 0) {
      setIsActive(false)
      setIsWorking((prev) => !prev)
      setTime(isWorking ? 300 : 1500);
    }

    return () => clearInterval(interval)
  }, [isActive, time])

  const handleStartStop = () => {
    playSound();
    setIsActive(!isActive);
  }

  const playSound = async() => {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/click.mp3.mp3")
    );

    await sound.playAsync();
  }


  return (
    // SafeAreaView funciona solo para iOS, para que el diseño no quede empalmado con status bar de iOS
    <SafeAreaView style={[styles.container, { backgroundColor: colors[currentTime] }]}>
      <View 
        style={{
          flex: 1,
          paddingHorizontal: 15, 
          paddingTop: Platform.OS == "android" && 30}}
      >
        <StatusBar style="auto" />
        <Text style={styles.text}>Pomodoro</Text>
        <Header 
          currentTime={ currentTime } 
          setCurrentTime={setCurrentTime} 
          setTime={ setTime }
        />
        <Timer time={ time } />
        <TouchableOpacity onPress={handleStartStop} style={styles.button}>
          <Text style={{ color: "white", fontWeight: "bold" }}>{ isActive ? "STOP" : "START"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Definicion de estilos para no tener estilos en linea
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 32, 
    fontWeight: "bold"
  },
  button: {
    alignItems: "center",
    backgroundColor: '#333333',
    padding: 15,
    marginTop: 15,
    borderRadius: 15
  }
});
