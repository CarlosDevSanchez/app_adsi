import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, Appbar, TextInput } from 'react-native-paper';
import { db } from '../../firebase';

const Home = () => {

    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        db.collection('task')
        .orderBy('date', 'asc')
        .onSnapshot((query) => {
            let docs = [];
            query.forEach(doc => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            setTasks(docs);
        });
    });

    const handlerSubmit = async () => {
        if(id.length){
            try{
                await db.collection('task')
                .doc(id)
                .update({
                    name: name,
                    description: description
                });
            }catch(e){
                console.log(e);
            }
        }else{
            try{
                await db.collection('task')
                .doc()
                .set({
                    name: name,
                    description: description,
                    date: new Date()
                });
            }catch(e){
                console.log(e)
            }
        }
        setName('');
        setDescription('');
    }

    const handlerDelete  = async (currentId) => {
        await db.collection('task')
            .doc(currentId)
            .delete()
    }

    const handlerUpdate = (task) => {
        setName(task.name);
        setDescription(task.description);
        setId(task.id);
    }

    return (
        <ScrollView style={{bottom: 20}}>
            <Appbar.Header>
                <Appbar.Content title="Aplicacion ADSI" />
            </Appbar.Header>
            <Card style={{padding: 30, top: 50}}>
                <Card.Content>
                <TextInput
                    label="Nombre"
                    mode='outlined'
                    value={name}
                    onChangeText={text => setName(text)}
                    />
                <TextInput
                    label="Descripcion"
                    mode='outlined'
                    multiline={true}
                    style={{height: 100 }}
                    value={description}
                    onChangeText={text => setDescription(text)}
                    />
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => handlerSubmit}>{id.length ? 'Modificar' : 'Guardar'}</Button>
                </Card.Actions>
            </Card>
            {
                tasks.map(task => (
                    <View key={task.id} style={{padding: 10, top: 50, bottom: 30}}>
                        <Card>
                            <Card.Title title={task.name} />
                            <Card.Content>
                                <Paragraph>
                                    {task.description}
                                </Paragraph>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={() => handlerUpdate(task)}>Modificar</Button>
                                <Button onPress={()=> handlerDelete(task.id)}>Borrar</Button>
                            </Card.Actions>
                        </Card>
                    </View>
                ))
            }
        </ScrollView>
    );
}

export default Home;