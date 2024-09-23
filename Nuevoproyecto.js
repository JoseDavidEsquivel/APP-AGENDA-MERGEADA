import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ProjectForm() {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [objectives, setObjectives] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [newObjective, setNewObjective] = useState('');
  const [newTask, setNewTask] = useState({ name: '', description: '', startDate: new Date(), endDate: new Date() });
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const addObjective = () => {
    if (newObjective.trim() !== '') {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const addOrUpdateTask = () => {
    if (newTask.name.trim() !== '' && newTask.description.trim() !== '') {
      if (editingTaskIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editingTaskIndex] = newTask;
        setTasks(updatedTasks);
        setEditingTaskIndex(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setNewTask({ name: '', description: '', startDate: new Date(), endDate: new Date() });
    }
  };

  const editTask = (index) => {
    setNewTask(tasks[index]);
    setEditingTaskIndex(index);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nuevo Proyecto</Text>
        <TouchableOpacity>
          <Text style={styles.menuButton}>⋮</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre del Proyecto"
        value={projectName}
        onChangeText={setProjectName}
      />
      
      <View style={styles.dateContainer}>
        <View style={styles.dateInput}>
          <Text style={styles.label}>Fecha de Inicio</Text>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
            <Text>{formatDate(startDate)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateInput}>
          <Text style={styles.label}>Fecha de Fin</Text>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
            <Text>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objetivos</Text>
        {objectives.map((objective, index) => (
          <Text key={index} style={styles.objective}>• {objective}</Text>
        ))}
        <View style={styles.addObjectiveContainer}>
          <TextInput
            style={[styles.input, styles.objectiveInput]}
            placeholder="Nuevo objetivo"
            value={newObjective}
            onChangeText={setNewObjective}
          />
          <TouchableOpacity style={styles.addButton} onPress={addObjective}>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tareas</Text>
        {tasks.map((task, index) => (
          <TouchableOpacity key={index} style={styles.task} onPress={() => editTask(index)}>
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <View style={styles.taskDates}>
              <Text style={styles.taskDate}>Inicio: {formatDate(task.startDate)}</Text>
              <Text style={styles.taskDate}>Fin: {formatDate(task.endDate)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.addTaskContainer}>
          <TextInput
            style={[styles.input, styles.taskInput]}
            placeholder="Nombre de la tarea"
            value={newTask.name}
            onChangeText={(text) => setNewTask({...newTask, name: text})}
          />
          <TextInput
            style={[styles.input, styles.taskInput]}
            placeholder="Descripción de la tarea"
            value={newTask.description}
            onChangeText={(text) => setNewTask({...newTask, description: text})}
          />
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
            <Text>Inicio: {formatDate(newTask.startDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
            <Text>Fin: {formatDate(newTask.endDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={addOrUpdateTask}>
            <AntDesign name={editingTaskIndex !== null ? "edit" : "plus"} size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    fontSize: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInput: {
    width: '48%',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  objective: {
    marginBottom: 4,
  },
  addObjectiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  objectiveInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  task: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 8,
    marginBottom: 8,
  },
  taskName: {
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
  },
  taskDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  taskDate: {
    fontSize: 12,
  },
  addTaskContainer: {
    marginTop: 8,
  },
  taskInput: {
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: 'black',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


