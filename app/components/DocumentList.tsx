import Model from './Model';
import { models } from '../../data/models';

export default function DocumentList() {
  return (
    <div className="flex gap-8">
      {models.map(model => (
          <Model key={model.id} href={model.href} src={model.src} alt={model.alt}>{model.name}</Model>
      ))}
    </div>
  );
}
