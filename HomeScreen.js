import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, startOfWeek, addDays, eachDayOfInterval } from 'date-fns';

const HomeScreen = ({ navigation }) => {
  const [isWeekView, setIsWeekView] = useState(false); // Estado para cambiar entre vista semanal y mensual

  const toggleView = () => {
    setIsWeekView(prevState => {
      console.log("View changed:", !prevState);
      return !prevState;
    });
  };

  const WeekView = () => {
    const today = new Date();
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // Comienza la semana el lunes
    const daysOfWeek = eachDayOfInterval({
      start: startOfWeekDate,
      end: addDays(startOfWeekDate, 6),
    });

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    return (
      <View style={styles.weekContainer}>
        <View style={styles.header}>
          <Text style={styles.monthText}>{format(today, 'MMMM yyyy')}</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <View style={styles.cell}></View>
              {daysOfWeek.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cell}
                  onPress={() => navigation.navigate('Day Data', { date: format(day, 'yyyy-MM-dd') })}
                >
                  <Text style={styles.dayText}>{format(day, 'd')}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {hours.map((hour, index) => (
              <View key={index} style={styles.row}>
                <View style={styles.cell}>
                  <Text>{hour}</Text>
                </View>
                {daysOfWeek.map((_, dayIndex) => (
                  <View key={dayIndex} style={styles.cell}></View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Botón para alternar entre la vista semanal y mensual */}
      <View style={styles.switchContainer}>
        <Button title={isWeekView ? 'Month View' : 'Week View'} onPress={toggleView} />
      </View>

      {isWeekView ? (
        <WeekView /> // Muestra la vista semanal si `isWeekView` es true
      ) : (
        <View style={styles.calendarContainer}>
          <Calendar
            monthFormat={'yyyy MMMM'}
            onDayPress={(day) => {
              navigation.navigate('Day Data', { date: day.dateString });
            }}
            theme={calendarTheme}
          />
        </View>
      )}
    </View>
  );
};

const calendarTheme = {
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: '#00adf5',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#00adf5',
  dayTextColor: '#2d4150',
  arrowColor: '#00adf5',
  monthTextColor: '#00adf5',
  textDayFontFamily: 'monospace',
  textMonthFontFamily: 'monospace',
  textDayHeaderFontFamily: 'monospace',
  textDayFontWeight: '900',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  weekContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  table: {
    flexDirection: 'column',
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    minWidth: 60,
    height: 40,
  },
  dayText: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;