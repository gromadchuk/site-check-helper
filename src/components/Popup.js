import React, { useEffect, useState } from 'react';

import { MantineProvider, Container, Tabs, Badge, Checkbox, ActionIcon, Loader, Center } from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons';

import { AppContext } from './AppContext';

import { Messages } from './Messages';
import { Listeners } from './Listeners';

export function Popup() {
    const colorScheme = useColorScheme();

    const [isLoading, setLoading] = useState(true);
    const [isPersist, setPersist] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedTab, setSelectedTab] = useLocalStorage({ key: 'selected-tab', defaultValue: 'message' });

    const tabs = [
        { value: 'message', title: 'Messages', component: <Messages /> },
        { value: 'listener', title: 'Listeners', component: <Listeners /> }
    ];

    const updateData = (data) => {
        if (!data) return;

        setPersist(data.persist);
        setItems(data.items);
    };

    const getMessages = () => {
        chrome.runtime.sendMessage({ type: 'requestMessages' }, updateData);
    };

    const updatePersist = (event) => {
        chrome.runtime.sendMessage({ type: 'setPersist', value: event.target.checked }, updateData);
    };

    const clearMessages = () => {
        chrome.runtime.sendMessage({ type: 'clearMessages' }, updateData);
    };

    const getEvents = (type, limit = 1000) => {
        return items.filter((item) => item.type === type).slice(0, limit);
    };

    const getBadge = (type) => {
        const rows = getEvents(type);

        if (rows.length === 0) {
            return null;
        }

        return <Badge>{ rows.length }</Badge>;
    };

    const getContext = () => {
        return {
            items,
            getEvents,
        }
    };

    useEffect(() => {
        chrome.runtime.sendMessage({ type: 'requestMessages' }, (data) => {
            updateData(data);

            setLoading(false);
        });

        const checkEvents = setInterval(getMessages, 1000);

        return () => clearInterval(checkEvents);
    }, []);

    const Content = () => {
        if (isLoading) {
            return (
                <Center style={{ height: 100 }}>
                    <Loader />
                </Center>
            );
        }

        return (
            <>
                <div style={ { display: 'flex' } }>
                    <ActionIcon onClick={ clearMessages }>
                        <IconTrash size={ 18 } />
                    </ActionIcon>

                    <Checkbox
                        checked={ isPersist }
                        onChange={ updatePersist }
                        style={{ margin: 6 }}
                        label="Persist logs"
                        size="xs"
                    />
                </div>

                <Tabs value={ selectedTab } onTabChange={ setSelectedTab }>
                    <Tabs.List>
                        {
                            tabs.map(({ value, title }, key) => (
                                <Tabs.Tab
                                    key={ key }
                                    value={ value }
                                    rightSection={ getBadge(value) }
                                >{ title }</Tabs.Tab>
                            ))
                        }
                    </Tabs.List>

                    {
                        tabs.map(({ value, component }, key) => (
                            <Tabs.Panel key={ key } value={ value } pt="xs">
                                { component }
                            </Tabs.Panel>
                        ))
                    }
                </Tabs>
            </>
        );
    };

    return (
        <MantineProvider theme={ { colorScheme } } withGlobalStyles withNormalizeCSS>
            <AppContext.Provider value={ getContext() }>
                <Container style={ { width: 600, padding: 10 } }>
                    { Content() }
                </Container>
            </AppContext.Provider>
        </MantineProvider>
    );

}
