import 'reflect-metadata';
import { DependencyInjectionContainer, Service, Repository } from '../../di/di';

/**
 * @fileoverview This file contains the test suite for the DependencyInjectionContainer class.
 */
describe('DependencyInjectionContainer', () => {
  let container: DependencyInjectionContainer;

  /**
   * @description This function is executed before each test case.
   */
  beforeEach(() => {
    container = new DependencyInjectionContainer();
  });

  /**
   * @description This test case verifies that a dependency can be registered and resolved.
   */
  it('should register and resolve a dependency', () => {
    class TestService {}
    const instance = new TestService();
    container.register(TestService, instance);
    const resolved = container.resolve(TestService);
    expect(resolved).toBe(instance);
  });

  /**
   * @description This test case verifies that an error is thrown when a dependency is not found.
   */
  it('should throw an error if a dependency is not found', () => {
    class TestService {}
    expect(() => container.resolve(TestService)).toThrow('Dependency not found for token: TestService');
  });

  /**
   * @description This test case verifies that decorated classes are auto-registered.
   */
  it('should auto-register decorated classes', () => {
    @Service()
    class TestService {}

    @Repository()
    class TestRepository {}

    @Service()
    class AnotherService {
      constructor(public testService: TestService, public testRepository: TestRepository) {}
    }

    container.register(TestService, new TestService());
    container.register(TestRepository, new TestRepository());
    container.register(AnotherService, new AnotherService(container.resolve(TestService), container.resolve(TestRepository)));


    const anotherService = container.resolve(AnotherService);
    expect(anotherService).toBeInstanceOf(AnotherService);
    expect(anotherService.testService).toBeInstanceOf(TestService);
    expect(anotherService.testRepository).toBeInstanceOf(TestRepository);
  });
});