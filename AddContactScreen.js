// AddContactScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const AddContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!name || !phone || !email) {
      Alert.alert("Error", "Nombre, teléfono y correo son campos obligatorios.");
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      address,
      notes,
    };

    try {
      let contactsJSON = await SecureStore.getItemAsync('contacts');
      let contacts = contactsJSON ? JSON.parse(contactsJSON) : [];
      contacts.push(newContact);

      await SecureStore.setItemAsync('contacts', JSON.stringify(contacts));

      navigation.navigate('ContactsList');
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  useEffect(() => {
    const resetForm = () => {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNotes('');
    };

    resetForm();

    const unsubscribe = navigation.addListener('focus', resetForm);

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.headerButton}
        >
          <Ionicons name="home" size={24} color="black" />
        </TouchableOpacity>
      ),
      title: 'Agregar Contacto',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Nuevo Contacto</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="numeric"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.longInput}
          placeholder="Domicilio"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Notas"
          value={notes}
          onChangeText={setNotes}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 20, // Borde circular
  },
  longInput: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 20, // Borde circular
    textAlignVertical: 'top',
    paddingTop: 5,   // Ajusta el texto hacia abajo
  },
  button: {
    backgroundColor: '#fff', // Blanco
    borderRadius: 20, // Borde circular
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
    borderWidth: 1, // Borde negro
    borderColor: '#000',
  },
  buttonText: {
    color: '#000', // Texto negro
    fontSize: 16,
  },
  headerButton: {
    marginLeft: 10,
  },
});

export default AddContactScreen;
