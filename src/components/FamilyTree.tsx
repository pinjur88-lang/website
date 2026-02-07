'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network/standalone/esm/vis-network';
import { DataSet } from 'vis-data/standalone/esm/vis-data';

interface Person {
    original_id: string;
    name: string;
    surname: string;
    birth_year?: string;
    death_year?: string;
    father_id?: string;
    mother_id?: string;
    origin?: string;
}

export default function FamilyTree() {
    const containerRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<Network | null>(null);
    const [items, setItems] = useState<Person[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    // Load initial sample
    useEffect(() => {
        fetch('/api/genealogy')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setItems(data);
                }
            });
    }, []);

    const handleSearch = async () => {
        if (!searchTerm) return;
        const res = await fetch(`/api/genealogy?search=${searchTerm}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
    };

    const loadPersonGraph = async (id: string) => {
        const res = await fetch(`/api/genealogy?id=${id}`);
        const data = await res.json();

        if (data.error) return;

        const { person, parents, children } = data;

        // Create datasets
        const nodes = new DataSet<any>([]);
        const edges = new DataSet<any>([]);

        const addNode = (p: Person, group: string, labelPrefix = '') => {
            if (!p) return;
            try {
                const existing = nodes.get(p.original_id);
                if (!existing) {
                    nodes.add({
                        id: p.original_id,
                        label: `${labelPrefix}${p.name} ${p.surname}\n(${p.birth_year || '?'})`,
                        group: group,
                        title: `Origin: ${p.origin || 'Unknown'}`
                    });
                }
            } catch (e) {
                console.error(e);
            }
        };

        addNode(person, 'focus');
        setSelectedPerson(person);

        parents?.forEach((p: Person) => {
            addNode(p, 'parent');
            edges.add({ from: p.original_id, to: person.original_id, arrows: 'to' });
        });

        children?.forEach((p: Person) => {
            addNode(p, 'child');
            edges.add({ from: person.original_id, to: p.original_id, arrows: 'to' });
        });

        if (containerRef.current) {
            const data = { nodes, edges };
            const options = {
                nodes: {
                    shape: 'box',
                    font: { size: 14 }
                },
                groups: {
                    focus: { color: { background: '#97C2FC', border: '#2B7CE9' }, borderWidth: 2 },
                    parent: { color: { background: '#E0E0E0', border: '#CCCCCC' } },
                    child: { color: { background: '#E0E0E0', border: '#CCCCCC' } }
                },
                layout: {
                    hierarchical: {
                        direction: 'UD',
                        sortMethod: 'directed',
                        levelSeparation: 100,
                        nodeSpacing: 150
                    }
                },
                physics: false
            };

            if (networkRef.current) {
                networkRef.current.setData(data);
            } else {
                networkRef.current = new Network(containerRef.current, data, options);
                networkRef.current.on('click', (params) => {
                    if (params.nodes.length > 0) {
                        const clickedId = params.nodes[0];
                        loadPersonGraph(clickedId);
                    }
                });
            }
        }
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search Surname..."
                    className="border p-2 rounded w-full max-w-sm"
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
            </div>

            <div className="flex gap-4 h-full min-h-[600px]">
                {/* Sidebar Results */}
                <div className="w-1/4 min-w-[250px] border rounded bg-white overflow-y-auto max-h-[800px]">
                    {items.length === 0 && <div className="p-4 text-gray-400">No results found</div>}
                    {items.map(p => (
                        <div
                            key={p.original_id}
                            className="p-3 border-b cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => loadPersonGraph(p.original_id)}
                        >
                            <div className="font-semibold text-gray-800">{p.name} {p.surname}</div>
                            <div className="text-sm text-gray-500">Born: {p.birth_year || '?'}</div>
                        </div>
                    ))}
                </div>

                {/* Graph */}
                <div className="flex-1 border rounded bg-gray-50 relative" ref={containerRef}>
                    {!selectedPerson && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            Select a person to view their tree
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
