import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Asegúrate de tener esta dependencia
import * as SecureStore from 'expo-secure-store';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params; // Objeto de tarea pasado desde la pantalla anterior
  const [description, setDescription] = useState(task.descripcion); // Descripción de la tarea
  const [notes, setNotes] = useState(task.notas); // Notas de la tarea
  const [date, setDate] = useState(task.dia); // Fecha de entrega de la tarea

  useFocusEffect(
    useCallback(() => {
      if (task) {
        setDescription(task.descripcion);
        setNotes(task.notas);
        setDate(task.dia);
      }
    }, [task])
  );

  const handleSave = async () => {
    try {
      // Recupera las tareas existentes
      const tasksJSON = await SecureStore.getItemAsync('tasks');
      const allTasks = tasksJSON ? JSON.parse(tasksJSON) : [];

      // Encuentra la tarea que se está editando y actualiza sus detalles
      const updatedTasks = allTasks.map(t =>
        t.id_tarea === task.id_tarea
          ? { ...t, descripcion: description, notas: notes, dia: date }
          : t
      );

      // Guarda las tareas actualizadas
      await SecureStore.setItemAsync('tasks', JSON.stringify(updatedTasks));

      Alert.alert("Tarea Actualizada", "La tarea ha sido actualizada exitosamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error actualizando la tarea: ", error);
      Alert.alert("Error", "No se pudo actualizar la tarea.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.label}>Fecha de entrega:</Text>
      <Text style={styles.dateDisplay}>{date}</Text> {/* Muestra la fecha original */}

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

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
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
    alignItems: 'center',
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

export default EditTaskScreen;
