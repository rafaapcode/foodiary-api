import { Registry } from '@kernel/di/registry';
import { Constructor } from '@shared/types/constructor';

export function Injectable(): ClassDecorator {
  return (target) => {

    Registry.getInstance().register(target as unknown as Constructor);
  };
}
