import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';

const EditAppointmentScreen = ({ route, navigation }) => {
  const { date, appointment } = route.params || {}; // Obtener la cita si está disponible
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [subjects, setSubjects] = useState(['']);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  console.log(date, appointment);

  useEffect(() => {
    if (appointment) {
      // Convierte la hora en formato "HH:mm" a objeto Date
      const parseTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        now.setHours(hours);
        now.setMinutes(minutes);
        now.setSeconds(0);
        return now;
      };

      setStartTime(parseTime(appointment.hora_inicio));
      setEndTime(parseTime(appointment.hora_fin));
      setSubjects(appointment.sujetos);
      setAddress(appointment.direccion);
      setNotes(appointment.notas);
      setIsEditing(true);
    }
  }, [appointment]);

  const handleSubjectChange = (text, index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = text;
    setSubjects(updatedSubjects);
  };

  const addNewSubject = () => {
    setSubjects([...subjects, '']);
  };

  const onChangeStartTime = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(new Date(selectedTime));
    }
  };

  const onChangeEndTime = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(new Date(selectedTime));
    }
  };

  const saveAppointment = async () => {
    try {
      let appointmentsJSON = await SecureStore.getItemAsync('appointments');
      let allAppointments = appointmentsJSON ? JSON.parse(appointmentsJSON) : [];

      const formatTime = (date) => date.toTimeString().split(' ')[0].substring(0, 5);

      const appointmentData = {
        id_cita: isEditing ? appointment.id_cita : (parseInt(await SecureStore.getItemAsync('lastId') || '0') + 1).toString(),
        hora_inicio: formatTime(startTime),
        hora_fin: formatTime(endTime),
        sujetos: subjects.filter(subject => subject.trim() !== ''),
        direccion: address,
        notas: notes,
        dia: date
      };

      if (isEditing) {
        allAppointments = allAppointments.map(app => 
          app.id_cita === appointmentData.id_cita ? appointmentData : app
        );
      } else {
        await SecureStore.setItemAsync('lastId', (parseInt(appointmentData.id_cita) + 1).toString());
        allAppointments.push(appointmentData);
      }

      await SecureStore.setItemAsync('appointments', JSON.stringify(allAppointments));

      Alert.alert("Cita Guardada", `La cita ha sido ${isEditing ? 'actualizada' : 'guardada'} exitosamente.`);
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
        <Text>{startTime.toTimeString().split(' ')[0].substring(0, 5)}</Text>
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
        <Text>{endTime.toTimeString().split(' ')[0].substring(0, 5)}</Text>
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
        <Text style={styles.saveButtonText}>{isEditing ? 'Actualizar Cita' : 'Guardar Cita'}</Text>
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

export default EditAppointmentScreen;