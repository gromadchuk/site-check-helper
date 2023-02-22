import React, { useContext, useState } from 'react';

import { Button, Center, Divider, Group, Input, Space, Switch, Textarea } from '@mantine/core';
import { Prism } from '@mantine/prism';

import { AppContext } from './AppContext';
import { IconHash } from '@tabler/icons';

export function Hash({ getEvents, allTabs, selectedTabs, isListenAllTabs }) {
    const [message, setMessage] = useState('');

    const rows = getEvents(['foundListenerHashChange', 'eventHashChange']);

    const changeHash = () => {
        const eventTabs = isListenAllTabs
            ? allTabs.map((tab) => tab.id)
            : selectedTabs;

        eventTabs.forEach((tabId) => {
            try {
                chrome.tabs.sendMessage(tabId, {
                    type: 'changeHash',
                    hash: message
                }, (response) => {
                    console.log('sendMessage response:', response);
                });
            } catch (error) {
                console.log('Error sending message', error);
            }
        });
    };

    const RowEvent = ({ data, date, newURL, oldURL, origin }, key) => {
        const oldHash = oldURL.split('#')[1];
        const newHash = newURL.split('#')[1];

        return (
            <div key={ key }>
                <Divider
                    my="xs"
                    label={ [
                        (new Date(date)).toLocaleTimeString(),
                        origin
                    ].join(' / ') }
                    labelPosition="center"
                />
                <Prism
                    key={ key }
                    language={ 'json' }
                >{ `#${ oldHash } => #${ newHash }` }</Prism>
            </div>
        );
    };

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

    const HashContent = () => {
        if (rows.length === 0) {
            return (
                <Center style={{ height: 100 }}>
                    No listeners
                </Center>
            );
        }

        return rows.map((data, key) => {
            if (data.type === 'eventHashChange') {
                return RowEvent(data, key);
            }

            if (data.type === 'foundListenerHashChange') {
                return RowListener(data, key);
            }

            console.log('unknown event', data);

            return 'unknown event';
        });
    };

    return (
        <>
            <Input
                icon={ <IconHash /> }
                placeholder="page hash"
                value={ message }
                onChange={ (event) => {
                    setMessage(event.target.value);
                } }
            />

            <Space h="md" />

            <Button
                radius="xs"
                size="xs"
                onClick={ changeHash }
            >Change hash</Button>

            <HashContent />
        </>
    );
}