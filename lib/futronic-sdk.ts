// Futronic SDK types and configuration
export interface FutronicDeviceInfo {
  id: string;
  name: string;
  vendor: string;
  model: string;
  serialNumber: string;
}

export interface FingerprintImage {
  data: ArrayBuffer;
  width: number;
  height: number;
  resolution: number;
  quality: number;
}

export interface FingerprintTemplate {
  data: ArrayBuffer;
  size: number;
  quality: number;
}

export interface CaptureOptions {
  timeout?: number;
  qualityThreshold?: number;
  captureMode?: 'single' | 'multiple';
}

export class FutronicSDKError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'FutronicSDKError';
  }
}

export class FutronicSDK {
  private isInitialized = false;
  private deviceConnected = false;
  private sdkVersion: string = '1.0.0';

  // Check if running in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Check if Futronic extension is available
  private isExtensionAvailable(): boolean {
    if (!this.isBrowser()) return false;
    return !!(window as any).Futronic;
  }

  // Simulate SDK for development/demo purposes
  private createMockSDK() {
    return {
      initialize: async (): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      },
      getDevices: async (): Promise<FutronicDeviceInfo[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [{
          id: 'mock-fs80h-001',
          name: 'Futronic FS80H Scanner',
          vendor: 'Futronic',
          model: 'FS80H',
          serialNumber: 'MOCK-001'
        }];
      },
      capture: async (options: CaptureOptions): Promise<FingerprintImage> => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create a mock fingerprint image
        const mockImageData = new ArrayBuffer(1024);
        return {
          data: mockImageData,
          width: 256,
          height: 288,
          resolution: 500,
          quality: 85
        };
      },
      extractTemplate: async (image: FingerprintImage): Promise<FingerprintTemplate> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const templateData = new ArrayBuffer(512);
        return {
          data: templateData,
          size: 512,
          quality: Math.min(95, image.quality + 10)
        };
      },
      close: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if we're in a browser environment
      if (!this.isBrowser()) {
        throw new FutronicSDKError(
          'Futronic SDK can only be initialized in a browser environment',
          'NO_BROWSER'
        );
      }

      let sdkInstance;

      // Try to use real Futronic SDK if available
      if (this.isExtensionAvailable()) {
        console.log('Initializing real Futronic SDK...');
        sdkInstance = (window as any).Futronic;
      } else {
        // Fallback to mock SDK for development
        console.warn('Futronic extension not available. Using mock SDK for development.');
        sdkInstance = this.createMockSDK();
        (window as any).Futronic = sdkInstance; // Attach mock to window for consistency
      }

      // Verify SDK instance has required methods
      const requiredMethods = ['initialize', 'getDevices', 'capture', 'extractTemplate', 'close'];
      const missingMethods = requiredMethods.filter(method => typeof sdkInstance[method] !== 'function');
      
      if (missingMethods.length > 0) {
        throw new FutronicSDKError(
          `Futronic SDK missing required methods: ${missingMethods.join(', ')}`,
          'INVALID_SDK'
        );
      }

      // Initialize the SDK
      this.isInitialized = await sdkInstance.initialize();
      
      if (!this.isInitialized) {
        throw new FutronicSDKError(
          'Failed to initialize Futronic SDK. Check device connection and drivers.',
          'INITIALIZATION_FAILED'
        );
      }

      console.log('Futronic SDK initialized successfully');
      return true;

    } catch (error) {
      if (error instanceof FutronicSDKError) {
        throw error;
      }
      
      throw new FutronicSDKError(
        `SDK initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'INITIALIZATION_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  async getDevices(): Promise<FutronicDeviceInfo[]> {
    if (!this.isInitialized) {
      throw new FutronicSDKError(
        'SDK not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }

    try {
      const devices = await (window as any).Futronic.getDevices();
      
      if (!Array.isArray(devices)) {
        throw new FutronicSDKError(
          'Invalid response from getDevices()',
          'INVALID_RESPONSE'
        );
      }

      return devices;
    } catch (error) {
      throw new FutronicSDKError(
        `Failed to get devices: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DEVICE_ENUMERATION_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  async captureFingerprint(options: CaptureOptions = {}): Promise<FingerprintImage> {
    if (!this.isInitialized) {
      throw new FutronicSDKError(
        'SDK not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }

    const defaultOptions: CaptureOptions = {
      timeout: 30000,
      qualityThreshold: 60,
      captureMode: 'single',
      ...options
    };

    try {
      const image = await (window as any).Futronic.capture(defaultOptions);
      
      // Validate the captured image
      if (!image || !image.data || !(image.data instanceof ArrayBuffer)) {
        throw new FutronicSDKError(
          'Invalid fingerprint image captured',
          'INVALID_IMAGE'
        );
      }

      return image;
    } catch (error) {
      if (error instanceof FutronicSDKError) {
        throw error;
      }
      
      throw new FutronicSDKError(
        `Fingerprint capture failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CAPTURE_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  async extractTemplate(image: FingerprintImage): Promise<FingerprintTemplate> {
    if (!this.isInitialized) {
      throw new FutronicSDKError(
        'SDK not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }

    try {
      const template = await (window as any).Futronic.extractTemplate(image);
      
      if (!template || !template.data || !(template.data instanceof ArrayBuffer)) {
        throw new FutronicSDKError(
          'Invalid template extracted',
          'INVALID_TEMPLATE'
        );
      }

      return template;
    } catch (error) {
      if (error instanceof FutronicSDKError) {
        throw error;
      }
      
      throw new FutronicSDKError(
        `Template extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'EXTRACTION_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  async close(): Promise<void> {
    try {
      if (this.isInitialized && (window as any).Futronic && typeof (window as any).Futronic.close === 'function') {
        await (window as any).Futronic.close();
      }
      this.isInitialized = false;
      this.deviceConnected = false;
    } catch (error) {
      console.warn('Error closing Futronic SDK:', error);
    }
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      deviceConnected: this.deviceConnected,
      sdkVersion: this.sdkVersion,
      extensionAvailable: this.isExtensionAvailable(),
      browserEnvironment: this.isBrowser()
    };
  }
}