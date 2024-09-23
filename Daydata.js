import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';

const Daydata = ({ route, navigation }) => {
  const [dayselected, setToday] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isTaskFinished, setIsTaskFinished] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [tasks, setTasks] = useState([]);

  const { date } = route.params;

  const formatDate = (date) => date.toISOString().split('T')[0];
  const convertToDate = (dateString) => new Date(dateString);

  useEffect(() => {
    if (date) {
      const convertedDate = convertToDate(date);
      setSelectedDate(convertedDate);
      setToday(formatDate(convertedDate));
      loadAppointments(date);
      loadTasks(date);
    } else {
      const today = new Date();
      setToday(formatDate(today));
      loadAppointments(formatDate(today));
      loadTasks(formatDate(today));
    }
  }, [date]);

  const loadAppointments = async (date) => {
    try {
      const appointmentsJSON = await SecureStore.getItemAsync('appointments');
      const allAppointments = appointmentsJSON ? JSON.parse(appointmentsJSON) : [];
      const formattedDate = formatDate(new Date(date));
      const filteredAppointments = allAppointments.filter(
        (appointment) => appointment.dia === formattedDate
      );
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error("Error loading appointments: ", error);
    }
  };

  const loadTasks = async (date) => {
    try {
      const tasksJSON = await SecureStore.getItemAsync('tasks');
      const allTasks = tasksJSON ? JSON.parse(tasksJSON) : [];
      const formattedDate = formatDate(new Date(date));
      const filteredTasks = allTasks.filter(
        (task) => task.dia === formattedDate
      );
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error loading tasks: ", error);
    }
  };

  const deleteTask = async (id_tarea) => {
    try {
      const tasksJSON = await SecureStore.getItemAsync('tasks');
      const allTasks = tasksJSON ? JSON.parse(tasksJSON) : [];
      const updatedTasks = allTasks.filter((task) => task.id_tarea !== id_tarea);
      await SecureStore.setItemAsync('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      Alert.alert("Tarea Eliminada", "La tarea ha sido eliminada exitosamente.");
    } catch (error) {
      console.error("Error deleting task: ", error);
      Alert.alert("Error", "No se pudo eliminar la tarea.");
    }
  };

  const onChangeDate = (event, newDate) => {
    setShowDatePicker(false);
    if (newDate) {
      const formattedDate = formatDate(newDate);
      setSelectedDate(newDate);
      setToday(formattedDate);
      loadAppointments(formattedDate);
      loadTasks(formattedDate);
    }
  };

  const toggleTaskStatus = () => {
    setIsTaskFinished(!isTaskFinished);
  };

  const handlePress = () => {
    Alert.alert(
      "Nueva Cita o Tarea",
      "Selecciona una acción.",
      [
        {
          text: "Nueva Cita",
          onPress: () => navigation.navigate('Add Appointment', { date: formatDate(selectedDate) })
        },
        {
          text: "Nueva Tarea",
          onPress: () => navigation.navigate('Add Task', { date: formatDate(selectedDate) })
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{dayselected}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={24} color="white" />
        </TouchableOpacity>
      </View>

    
        <View style={styles.childcontainer}>
          <Text style={styles.subtitle}>Citas</Text>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <View key={appointment.id_cita} style={styles.cita}>
                <View style={styles.citachild1}>
                  <Text style={styles.text}>{appointment.hora_inicio}</Text>
                  <Text style={styles.text}>{appointment.hora_fin}</Text>
                  <Text style={styles.text2}>{appointment.direccion}</Text>
                </View>
                <View style={styles.citachild2}>
                  <Text style={styles.text}>{appointment.sujetos.join(', ')}</Text>
                  <Text style={styles.text2}>{appointment.notas}</Text>
                </View>
                <View style={styles.citachild3}>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Edit Appointment', { date: dayselected, appointment })}>
                    <Ionicons name="pencil" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonRed} onPress={() => deleteAppointment(appointment.id_cita)}>
                    <Ionicons name="trash" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No hay citas para este día.</Text>
          )}
        </View>

        <View style={styles.childcontainer}>
          <Text style={styles.subtitle}>Tareas</Text>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <View key={task.id_tarea} style={styles.tarea}>
                <View style={styles.tareachild1}>
                  <Text style={styles.text}>{task.descripcion}</Text>
                  <Text style={styles.text2}>Notas: {task.notas}</Text>
                </View>
                <View style={styles.tareachild2}>
                  <Text style={styles.text2}>Fecha de Entrega: {task.dia}</Text>
                  <TouchableOpacity
                    style={[styles.buttonStatus, task.finalizado ? styles.buttonGreen : styles.buttonRed]}
                    onPress={toggleTaskStatus}
                  >
                    <Text style={styles.buttonText}>{task.finalizado ? 'Finalizado' : 'Sin Finalizar'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.tareaoptions}>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Edit Task', { task })}>
                    <Ionicons name="pencil" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonRed} onPress={() => deleteTask(task.id_tarea)}>
                    <Ionicons name="trash" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No hay tareas para este día.</Text>
          )}
        </View>
      

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
  childcontainer: {
    padding: 0,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '100%',
    borderBlockColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
  },
  cita: {
    flexDirection: 'row',
    padding: 0,
    marginBottom: 10,
    width: '100%',
  },
  citachild1: {
    flex: 11,
    padding: 0,
  },
  citachild2: {
    flex: 13,
    padding: 0,
    paddingLeft: 5,
  },
  citachild3: {
    flex: 5,
    padding: 0,
    paddingLeft: 5,
  },
  tarea: {
    flexDirection: 'row',
    padding: 0,
    marginBottom: 10,
    width: '100%',
  },
  tareachild1: {
    flex: 11,
    padding: 0,
  },
  tareachild2: {
    flex: 13,
    padding: 0,
    paddingLeft: 5,
  },
  tareaoptions: {
    flex: 5,
    padding: 0,
    paddingLeft: 5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  text: {
    fontSize: 18,
    marginLeft: 0,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  text2: {
    fontSize: 14,
    marginLeft: 0,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  text3: {
    fontSize: 12,
    marginLeft: 0,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#000',
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonRed: {
    backgroundColor: 'red',
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonGreen: {
    backgroundColor: 'green',
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },

});

export default Daydata;
