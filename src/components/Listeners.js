import React, { useContext } from 'react';

import { Center, Divider, Group } from '@mantine/core';
import { Prism } from '@mantine/prism';

import { AppContext } from './AppContext';

export function Listeners() {
    const context = useContext(AppContext);
    const rows = context.getEvents('listener', 100);

    const fixRow = ({ stack, date }) => {
        console.log('sass', location.origin);

        stack = stack.replace(new RegExp(`\\(${ location.origin }(.*)\\)`), '');

        try {
            let lines = stack.split('\n');

            lines.shift();

            return {
                stack: lines.join('\n'),
                date,
            };
        } catch (error) {
            console.log('Error pars stack', error, stack);
        }

        return { stack, date };
    };

    if (rows.length === 0) {
        return (
            <Center style={{ height: 100 }}>
                No listeners
            </Center>
        );
    }

    return rows.map(fixRow).map(({ stack, date }, key) => (
        <div key={ key }>
            <Divider my="xs" label={ (new Date(date)).toLocaleTimeString() } labelPosition="center" />
            <Prism language="javascript">{ stack }</Prism>
        </div>
    ));
}