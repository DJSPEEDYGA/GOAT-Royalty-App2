#!/usr/bin/env node

/**
 * Hostinger API Manager for GOAT Royalty App
 * Manages VPS instances through Hostinger API
 */

const axios = require('axios');
const readline = require('readline');

class HostingerAPIManager {
  constructor(apiToken) {
    if (!apiToken) {
      throw new Error('API token is required. Set HOSTINGER_API_TOKEN environment variable.');
    }
    
    this.apiToken = apiToken;
    this.baseURL = 'https://developers.hostinger.com/api/vps/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async listVirtualMachines() {
    try {
      const response = await this.client.get('/virtual-machines');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getVirtualMachine(vmId) {
    try {
      const response = await this.client.get(`/virtual-machines/${vmId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async startVirtualMachine(vmId) {
    try {
      const response = await this.client.post(`/virtual-machines/${vmId}/start`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async stopVirtualMachine(vmId) {
    try {
      const response = await this.client.post(`/virtual-machines/${vmId}/stop`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async restartVirtualMachine(vmId) {
    try {
      const response = await this.client.post(`/virtual-machines/${vmId}/restart`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || error.response.statusText;
      
      if (status === 401) {
        throw new Error('❌ Unauthorized: Invalid or expired API token');
      } else if (status === 403) {
        throw new Error('❌ Forbidden: Insufficient permissions');
      } else if (status === 404) {
        throw new Error('❌ Not Found: Resource does not exist');
      } else if (status === 429) {
        throw new Error('❌ Rate Limited: Too many requests');
      } else {
        throw new Error(`❌ API Error (${status}): ${message}`);
      }
    } else if (error.request) {
      throw new Error('❌ Network Error: Unable to reach Hostinger API');
    } else {
      throw error;
    }
  }
}

// CLI Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function displayMenu() {
  console.log('\n================================');
  console.log('Hostinger VPS Manager');
  console.log('================================\n');
  console.log('1. List all virtual machines');
  console.log('2. Get VM details');
  console.log('3. Start VM');
  console.log('4. Stop VM');
  console.log('5. Restart VM');
  console.log('6. Test API connection');
  console.log('0. Exit\n');
}

async function main() {
  const apiToken = process.env.HOSTINGER_API_TOKEN;
  
  if (!apiToken) {
    console.error('❌ Error: HOSTINGER_API_TOKEN environment variable not set');
    console.log('\nUsage:');
    console.log('  export HOSTINGER_API_TOKEN="your_token_here"');
    console.log('  node hostinger-api-manager.js\n');
    process.exit(1);
  }

  const api = new HostingerAPIManager(apiToken);
  let running = true;

  console.log('✅ API token loaded successfully\n');

  while (running) {
    await displayMenu();
    const choice = await question('Select an option: ');

    try {
      switch (choice.trim()) {
        case '1': {
          console.log('\n📋 Fetching virtual machines...\n');
          const vms = await api.listVirtualMachines();
          
          if (vms.data && vms.data.length > 0) {
            console.log('Virtual Machines:');
            console.log('─────────────────────────────────────────');
            vms.data.forEach((vm, index) => {
              console.log(`\n${index + 1}. ${vm.name || 'Unnamed'}`);
              console.log(`   ID: ${vm.id}`);
              console.log(`   Status: ${vm.status}`);
              console.log(`   IP: ${vm.ip_address || 'N/A'}`);
              console.log(`   Region: ${vm.region || 'N/A'}`);
            });
            console.log('\n─────────────────────────────────────────');
          } else {
            console.log('No virtual machines found.');
          }
          break;
        }

        case '2': {
          const vmId = await question('\nEnter VM ID: ');
          console.log('\n📋 Fetching VM details...\n');
          const vm = await api.getVirtualMachine(vmId.trim());
          console.log('VM Details:');
          console.log('─────────────────────────────────────────');
          console.log(JSON.stringify(vm, null, 2));
          console.log('─────────────────────────────────────────');
          break;
        }

        case '3': {
          const vmId = await question('\nEnter VM ID to start: ');
          console.log('\n🚀 Starting VM...\n');
          const result = await api.startVirtualMachine(vmId.trim());
          console.log('✅ VM start command sent successfully');
          console.log(JSON.stringify(result, null, 2));
          break;
        }

        case '4': {
          const vmId = await question('\nEnter VM ID to stop: ');
          const confirm = await question('⚠️  Are you sure you want to stop this VM? (yes/no): ');
          
          if (confirm.toLowerCase() === 'yes') {
            console.log('\n🛑 Stopping VM...\n');
            const result = await api.stopVirtualMachine(vmId.trim());
            console.log('✅ VM stop command sent successfully');
            console.log(JSON.stringify(result, null, 2));
          } else {
            console.log('Operation cancelled.');
          }
          break;
        }

        case '5': {
          const vmId = await question('\nEnter VM ID to restart: ');
          console.log('\n🔄 Restarting VM...\n');
          const result = await api.restartVirtualMachine(vmId.trim());
          console.log('✅ VM restart command sent successfully');
          console.log(JSON.stringify(result, null, 2));
          break;
        }

        case '6': {
          console.log('\n🔍 Testing API connection...\n');
          const vms = await api.listVirtualMachines();
          console.log('✅ API connection successful!');
          console.log(`Found ${vms.data ? vms.data.length : 0} virtual machine(s)`);
          break;
        }

        case '0': {
          console.log('\n👋 Goodbye!\n');
          running = false;
          break;
        }

        default: {
          console.log('\n❌ Invalid option. Please try again.');
        }
      }
    } catch (error) {
      console.error(`\n${error.message}\n`);
    }

    if (running) {
      await question('\nPress Enter to continue...');
    }
  }

  rl.close();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = HostingerAPIManager;