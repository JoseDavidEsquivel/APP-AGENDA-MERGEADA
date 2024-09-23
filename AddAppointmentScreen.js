import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';

const AddAppointmentScreen = ({ route, navigation }) => {
  const { date } = route.params; // Fecha seleccionada
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [subjects, setSubjects] = useState(['']); // Lista dinámica de sujetos
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');


  console.log(date)

  // Manejo de cambios en los sujetos
  const handleSubjectChange = (text, index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = text;
    setSubjects(updatedSubjects);
  };

  // Agregar un nuevo campo para sujeto
  const addNewSubject = () => {
    setSubjects([...subjects, '']);
  };

  // Manejo de selección de hora de inicio y fin
  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const saveAppointment = async () => {
    try {
      // Recupera el último ID
      let lastId = await SecureStore.getItemAsync('lastId');
      lastId = lastId ? parseInt(lastId, 10) : 0;

      // Genera un nuevo ID
      const newId = lastId + 1;
      await SecureStore.setItemAsync('lastId', newId.toString());

      const appointment = {
        id_cita: newId.toString(), // Usa el nuevo ID para la cita
        hora_inicio: startTime.toLocaleTimeString('es-ES'),
        hora_fin: endTime.toLocaleTimeString('es-ES'),
        sujetos: subjects.filter(subject => subject.trim() !== ''),
        direccion: address,
        notas: notes,
        dia: date // Usa la fecha seleccionada
      };

      // Recupera las citas existentes
      const appointmentsJSON = await SecureStore.getItemAsync('appointments');
      const allAppointments = appointmentsJSON ? JSON.parse(appointmentsJSON) : [];

      // Agrega la nueva cita
      allAppointments.push(appointment);

      // Guarda las citas actualizadas
      await SecureStore.setItemAsync('appointments', JSON.stringify(allAppointments));

      Alert.alert("Cita Guardada", "La cita ha sido guardada exitosamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving appointment: ", error);
      Alert.alert("Error", "No se pudo guardar la cita.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Fecha de la cita: {date}</Text>

      <Text style={styles.label}>Hora de Inicio:</Text>
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.timeButton}>
        <Text>{startTime.toLocaleTimeString('es-ES')}</Text>
      </TouchableOpacity>

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeStartTime}
        />
      )}

      <Text style={styles.label}>Hora de Fin:</Text>
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.timeButton}>
        <Text>{endTime.toLocaleTimeString('es-ES')}</Text>
      </TouchableOpacity>

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeEndTime}
        />
      )}

      <Text style={styles.label}>Sujetos:</Text>
      {subjects.map((subject, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Sujeto ${index + 1}`}
          value={subject}
          onChangeText={(text) => handleSubjectChange(text, index)}
        />
      ))}
      <TouchableOpacity onPress={addNewSubject} style={styles.addButton}>
        <Text style={styles.addButtonText}>Agregar otro sujeto</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Dirección:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa la dirección"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Notas:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa notas"
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity onPress={saveAppointment} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  timeButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddAppointmentScreen;
