// ContactsListScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ContactsListScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch contacts from SecureStore
  const fetchContacts = async () => {
    try {
      const contactsJSON = await SecureStore.getItemAsync('contacts');
      if (contactsJSON) {
        setContacts(JSON.parse(contactsJSON));
      }
    } catch (error) {
      console.error("Error fetching contacts: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [])
  );

  // Handle contact deletion
  const handleDelete = async (id) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    try {
      await SecureStore.setItemAsync('contacts', JSON.stringify(updatedContacts));
    } catch (error) {
      console.error("Error saving contacts: ", error);
    }
  };

  // Toggle expanded view
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Render contact item
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>Tel: {item.phone}</Text>
      <Text style={styles.itemText}>Email: {item.email}</Text>
      {expandedId === item.id && (
        <>
          <Text style={styles.itemText}>Address: {item.address}</Text>
          <Text style={styles.itemText}>Notes: {item.notes}</Text>
        </>
      )}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => toggleExpand(item.id)}
      >
        <Text style={styles.expandButtonText}>
          {expandedId === item.id ? 'Ver menos' : 'Ver más'}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('EditContact', { contact: item })}>
        <Ionicons name="pencil" size={20} color="black" />
      </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <MaterialIcons name="delete" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Handle back button press to navigate to Home screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  // Set header options
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.headerButton}
        >
          <Ionicons name="home" size={20} color="black" />
        </TouchableOpacity>
      ),
      title: 'Lista de Contactos',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {contacts.length === 0 ? (
        <Text style={styles.noContactsText}>No hay contactos disponibles.</Text>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Text style={styles.addButtonText}>Agregar Contacto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  item: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 8,
    borderWidth: 1, // Borde negro
    borderColor: '#000',
  },
  itemText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff', // Blanco
    padding: 10,
    borderRadius: 50,
    borderWidth: 1, // Borde negro
    borderColor: '#000',
  },
  addButtonText: {
    color: '#000', // Texto negro
    fontSize: 14,
  },
  noContactsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  headerButton: {
    marginLeft: 10,
  },
  expandButton: {
    marginTop: 8,
  },
  expandButtonText: {
    color: '#000', // Texto negro
    fontSize: 14,
  },
});


export default ContactsListScreen;
