import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AddTaskScreen = ({ route, navigation }) => {
  const { date } = route.params; // Fecha proporcionada (dia)
  const [description, setDescription] = useState(''); // Descripción de la tarea
  const [notes, setNotes] = useState(''); // Notas de la tarea

  const saveTask = async () => {
    try {
      // Recupera el último ID de tarea
      let lastId = await SecureStore.getItemAsync('lastTaskId');
      lastId = lastId ? parseInt(lastId, 10) : 0;

      // Genera un nuevo ID para la tarea
      const newId = lastId + 1;
      await SecureStore.setItemAsync('lastTaskId', newId.toString());

      const task = {
        id_tarea: newId.toString(),
        dia: date, // Usa la fecha proporcionada
        descripcion: description,
        notas: notes,
        finalizado: 0, // Por defecto, la tarea está pendiente
      };

      // Recupera las tareas existentes
      const tasksJSON = await SecureStore.getItemAsync('tasks');
      const allTasks = tasksJSON ? JSON.parse(tasksJSON) : [];

      // Agrega la nueva tarea
      allTasks.push(task);

      // Guarda las tareas actualizadas
      await SecureStore.setItemAsync('tasks', JSON.stringify(allTasks));

      Alert.alert("Tarea Guardada", "La tarea ha sido guardada exitosamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error guardando la tarea: ", error);
      Alert.alert("Error", "No se pudo guardar la tarea.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Fecha de entrega: {date}</Text>
      

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa la descripción"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Notas:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa notas"
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity onPress={saveTask} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Tarea</Text>
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
  dateDisplay: {
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
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;
