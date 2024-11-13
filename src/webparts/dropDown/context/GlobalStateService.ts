import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';

export class GlobalStateService {
  public static readonly serviceKey: ServiceKey<GlobalStateService> =
    ServiceKey.create<GlobalStateService>(
      'filter-icon:GlobalStateService',
      GlobalStateService
    );

  // Store states by name (e.g., "Military" => true/false)
  private states: { [key: string]: boolean } = {};
  private subscribers: { [key: string]: ((newState: boolean) => void)[] } = {};

  constructor(serviceScope: ServiceScope) {}

  // Get the state for a specific filter name
  public getState(name: string): boolean {
    return this.states[name] || false; // Default to false if not defined
  }

  // Toggle the state for a specific filter name
  public toggleState(name: string): void {
    this.states[name] = !this.states[name];
    this.notifySubscribers(name);
  }

  // Subscribe to state changes for a specific filter name
  public subscribe(name: string, callback: (newState: boolean) => void): void {
    if (!this.subscribers[name]) {
      this.subscribers[name] = [];
    }
    this.subscribers[name].push(callback);
  }

  // Notify subscribers of a state change for a specific filter name
  private notifySubscribers(name: string): void {
    const callbacks = this.subscribers[name];
    if (callbacks) {
      callbacks.forEach(callback => callback(this.states[name]));
    }
  }
}
