const axios = require('axios');
const debug = require('debug')('testApi');
const { faker } = require('@faker-js/faker');

// Base URL of your API
const BASE_URL = 'http://localhost:8001/api/fighters';

// Function to create a new fighter
const createFighter = async () => {
    const fighterData = {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 60 }),
        height: faker.number.int({ min: 150, max: 200 }),
        weight: faker.number.int({ min: 50, max: 120 }),
        hometown: faker.location.city(),
        stats: {
            wins: faker.number.int({ min: 0, max: 20 }),
            losses: faker.number.int({ min: 0, max: 20 }),
            draws: faker.number.int({ min: 0, max: 10 }),
        },
    };
    try {
        const response = await axios.post(BASE_URL, fighterData);
        debug(`Created fighter: ${response.data.name}`);
        return response.data;
    } catch (error) {
        debug(`Error creating fighter: ${error.message}`);
    }
};

// Function to get all fighters
const getAllFighters = async () => {
    try {
        const response = await axios.get(BASE_URL);
        debug(`Fetched ${response.data.fighters.length} fighters`);
        return response.data.fighters;
    } catch (error) {
        debug(`Error fetching fighters: ${error.message}`);
    }
};

// Function to get a fighter by ID
const getFighterById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        debug(`Fetched fighter: ${response.data.name}`);
        return response.data;
    } catch (error) {
        debug(`Error fetching fighter by ID: ${error.message}`);
    }
};

// Function to update a fighter
const updateFighter = async (id, updateData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, updateData);
        debug(`Updated fighter: ${response.data.name}`);
        return response.data;
    } catch (error) {
        debug(`Error updating fighter: ${error.message}`);
    }
};

// Function to delete a fighter
const deleteFighter = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        debug(`Deleted fighter: ${id}`);
        return response.data;
    } catch (error) {
        debug(`Error deleting fighter: ${error.message}`);
    }
};

// Main function to run all tests
const runTests = async () => {
    debug('Starting API tests...');

    // Create multiple fighters
    for (let i = 0; i < 5; i++) {
        await createFighter();
    }

    // Get all fighters
    const fighters = await getAllFighters();

    if (fighters && fighters.length > 0) {
        // Get a single fighter by ID
        await getFighterById(fighters[0]._id);

        // Update the first fighter
        const updateData = { name: 'Updated Name', age: 35 };
        await updateFighter(fighters[0]._id, updateData);

        // Delete the first fighter
        await deleteFighter(fighters[0]._id);
    }

    debug('API tests completed.');
};

runTests();



