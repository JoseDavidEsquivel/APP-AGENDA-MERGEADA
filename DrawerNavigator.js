// DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen'; // Asegúrate de que la ruta sea correcta
import AddContact from './AddContactScreen'; // Asegúrate de que la ruta sea correcta
import ContactsList from './ContactsListScreen'; // Asegúrate de que la ruta sea correcta
import Daydata from './Daydata'
import AddAppointmentScreen from './AddAppointmentScreen'
import EditAppointmentScreen from './EditAppointmentScreen'
import AddTaskScreen from './AddTaskScreen'
import EditTaskScreen from './EditTaskScreen'

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Add Contact" component={AddContact} />
        <Drawer.Screen name="View Contacts" component={ContactsList} />
        <Drawer.Screen name="Day Data" component={Daydata} />
        <Drawer.Screen name="Add Appointment" component={AddAppointmentScreen} />
        <Drawer.Screen name="Edit Appointment" component={EditAppointmentScreen} />
        <Drawer.Screen name="Add Task" component={AddTaskScreen} />
        <Drawer.Screen name="Edit Task" component={EditTaskScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;