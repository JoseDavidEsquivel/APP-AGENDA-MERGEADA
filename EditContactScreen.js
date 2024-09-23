// EditContactScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const EditContactScreen = ({ route, navigation }) => {
  const { contact } = route.params;

  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [email, setEmail] = useState(contact.email);
  const [address, setAddress] = useState(contact.address || '');
  const [notes, setNotes] = useState(contact.notes || '');

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !phone || !email) {
      Alert.alert("Error", "Nombre, teléfono y correo son campos obligatorios.");
      return;
    }

    const updatedContact = {
      id: contact.id,
      name,
      phone,
      email,
      address,
      notes,
    };

    try {
      let contactsJSON = await SecureStore.getItemAsync('contacts');
      let contacts = contactsJSON ? JSON.parse(contactsJSON) : [];
      contacts = contacts.map(contact => contact.id === updatedContact.id ? updatedContact : contact);

      await SecureStore.setItemAsync('contacts', JSON.stringify(contacts));

      navigation.navigate('ContactsList');
    } catch (error) {
      console.error("Error updating contact: ", error);
    }
  };

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ContactsList')}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      title: 'Editar Contacto',
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Editar Contacto</Text>
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
          <Text style={styles.buttonText}>Guardar Cambios</Text>
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
    paddingTop: 10,   // Ajusta el texto hacia abajo
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

export default EditContactScreen;
