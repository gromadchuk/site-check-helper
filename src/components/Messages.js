import React, { useContext, useState } from 'react';

import { Button, Center, Divider, Group, Space, Switch, Textarea } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Prism } from '@mantine/prism';

import { AppContext } from './AppContext';

export function Messages({ getEvents, allTabs, selectedTabs, isListenAllTabs }) {
    const [message, setMessage] = useState('');
    const [sendError, setSendError] = useState(null);
    const [isMessageObject, setMessageObject] = useLocalStorage({ key: 'is-message-string', defaultValue: true });

    const rows = getEvents(['foundListenerMessage', 'eventMessage']);

    const getFormattedReadMessage = (value) => {
        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }

        return `${ value }`;
    };

    const sendMessages = () => {
        setSendError(null);

        const eventTabs = isListenAllTabs
            ? allTabs.map((tab) => tab.id)
            : selectedTabs;

        eventTabs.forEach((tabId) => {
            try {
                const event = isMessageObject ? JSON.parse(message) : message;

                chrome.tabs.sendMessage(tabId, {
                    type: 'sendMessage',
                    event
                }, (response) => {
                    console.log('sendMessage response:', response);
                });
            } catch (error) {
                console.log('Error sending message', error);

                setSendError(error.message);
            }
        });
    };

    const RowEvent = ({ data, origin, date }, key) => (
        <div key={ key }>
            <Divider
                my="xs"
                label={ [
                    (new Date(date)).toLocaleTimeString(),
                    typeof data,
                    origin
                ].join(' / ') }
                labelPosition="center"
            />
            <Prism
                key={ key }
                language={ typeof data === 'string' ? 'text' : 'json' }
            >{ getFormattedReadMessage(data) }</Prism>
        </div>
    );

    const RowListener = ({ stack, date, origin }, key) => (
        <div key={ key }>
            <Divider
                my="xs"
                label={ [
                    (new Date(date)).toLocaleTimeString(),
                    origin
                ].join(' / ') }
                labelPosition="center"
            />
            <Prism language="javascript">{ stack }</Prism>
        </div>
    );

    const MessagesContent = () => {
        if (rows.length === 0) {
            return (
                <Center style={{ height: 100 }}>
                    No messages
                </Center>
            );
        }

        return rows.map((data, key) => {
            if (data.type === 'eventMessage') {
                return RowEvent(data, key);
            }

            if (data.type === 'foundListenerMessage') {
                return RowListener(data, key);
            }

            console.log('unknown event', data);

            return 'unknown event';
        });
    };

    return (
        <>
            <Textarea
                placeholder="Message to send"
                autosize
                value={ message }
                error={ sendError }
                onChange={ (event) => {
                    setMessage(event.target.value);
                } }
            />

            <Space h="md" />

            <Group>
                <Button
                    radius="xs"
                    size="xs"
                    onClick={ sendMessages }
                >
                    Send message
                </Button>

                <Switch
                    label={ 'Send object (JSON.parse)' }
                    checked={ isMessageObject }
                    onChange={ (event) => setMessageObject(event.currentTarget.checked) } />
            </Group>

            <MessagesContent />
        </>
    );
}