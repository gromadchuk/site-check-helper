import React from 'react';

import { MantineProvider, Container, Tabs, Badge, Checkbox, Divider, Button } from '@mantine/core';

import { Messages } from './Messages';
import { Hash } from './Hash';

const isDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

export class App extends React.Component {

    state = {
        allEvents: [],
        selectedTabs: [],
        allTabs: [],
        isListenAllTabs: false,
        selectedTab: localStorage.selectedTab || 'messages'
    }

    allowEvents = [
        'foundListenerMessage',
        'eventMessage',
        'foundListenerHashChange',
        'eventHashChange',
    ]

    tabs = [
        {
            value: 'messages',
            title: 'Messages',
            component: Messages,
            count: ['foundListenerMessage', 'eventMessage']
        },
        {
            value: 'hash',
            title: 'Hash',
            component: Hash,
            count: ['foundListenerHashChange', 'eventHashChange']
        }
    ];

    componentDidMount() {
        this.updateCurrentTabs();

        chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
            if (changeInfo.title || changeInfo.status === 'complete') {
                this.updateCurrentTabs();
            }
        });

        chrome.tabs.onRemoved.addListener(() => {
            this.updateCurrentTabs();
        });

        chrome.runtime.onMessage.addListener((data, sender) => {
            if (!this.allowEvents.includes(data.type)) {
                return;
            }

            if (!data.origin) {
                data.origin = sender.origin;
            }

            data.tabId = sender.tab.id;

            if (this.state.isListenAllTabs || this.state.selectedTabs.includes(data.tabId)) {
                this.addEvent(data);
            }
        });
    }

    addEvent = (event) => {
        const events = this.state.allEvents.slice(0);

        events.unshift(event);

        this.setState({
            allEvents: events
        });
    };

    changeTabListener = (tabId) => {
        if (this.state.selectedTabs.includes(tabId)) {
            this.setState({
                selectedTabs: this.state.selectedTabs.filter((id) => id !== tabId)
            });
        } else {
            this.setState({
                selectedTabs: [...this.state.selectedTabs, tabId]
            });
        }
    };

    getEvents = (types = []) => {
        return this.state.allEvents.filter((item) => types.includes(item.type));
    };

    getBadge = (types) => {
        const totalCount = types.reduce((acc, type) => {
            return acc + this.getEvents(type).length;
        }, 0);

        if (totalCount === 0) {
            return null;
        }

        return <Badge>{ totalCount }</Badge>;
    };

    getContext = () => {
        return {
            allEvents: this.state.allEvents,
            isListenAllTabs: this.state.isListenAllTabs,
            selectedTabs: this.state.selectedTabs,
            allTabs: this.state.allTabs,
            getEvents: this.getEvents.bind(this),
        }
    };

    updateCurrentTabs = () => {
        chrome.tabs.query({}, (tabs) => {
            const filteredTabs = tabs
                .filter((tab) => !tab.url.startsWith('chrome'))
                .map((tab) => ({
                    id: tab.id,
                    title: tab.title,
                }));

            this.setState({
                allTabs: filteredTabs
            });
        });
    };

    Content = () => {
        return (
            <>
                <Checkbox
                    checked={ this.state.isListenAllTabs }
                    onChange={ (event) => {
                        this.setState({
                            isListenAllTabs: event.target.checked
                        });
                    } }
                    style={{ margin: 6 }}
                    label="Listen all tabs"
                    size="xs"
                />

                {
                    this.state.allTabs.map(({ id, title }) => (
                        <Button
                            key={ id }
                            variant={ this.state.selectedTabs.includes(id) ? 'default' : 'subtle' }
                            onClick={ () => this.changeTabListener(id) }
                            compact
                            disabled={ this.state.isListenAllTabs }
                        >{ title.length > 15 ? `${ title.slice(0, 15) }...` : title }</Button>
                    ))
                }

                <Divider my="sm" />

                <Tabs
                    value={ this.state.selectedTab }
                    onTabChange={ (tab) => {
                        this.setState({
                            selectedTab: tab
                        });
                        localStorage.selectedTab = tab;
                    } }
                >
                    <Tabs.List>
                        {
                            this.tabs.map(({ value, title, count }, key) => (
                                <Tabs.Tab
                                    key={ key }
                                    value={ value }
                                    rightSection={ this.getBadge(count) }
                                >{ title }</Tabs.Tab>
                            ))
                        }
                    </Tabs.List>

                    {
                        this.tabs.map(({ value, component }, key) => (
                            <Tabs.Panel key={ key } value={ value } pt="xs">
                                { React.createElement(component, { ...this.getContext() }) }
                            </Tabs.Panel>
                        ))
                    }
                </Tabs>
            </>
        );
    };

    render() {
        return (
            <MantineProvider theme={ { colorScheme: isDark ? 'dark' : 'light' } } withGlobalStyles withNormalizeCSS>
                <Container style={ { width: 600, padding: 10 } }>
                    { this.Content() }
                </Container>
            </MantineProvider>
        );
    }

}
