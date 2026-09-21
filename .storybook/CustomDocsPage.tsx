import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
} from '@storybook/addon-docs/blocks';

/**
 * Replaces Storybook's default autodocs layout for every component with
 * "tags: ['autodocs']". Built from the official Doc Blocks API rather than
 * CSS overrides, so it's robust across Storybook upgrades (unlike the
 * manager/preview `-head.html` CSS injection, which targets internal DOM).
 *
 * Layout: title/description -> live preview stage (Primary) -> Props (Controls)
 * -> Variants (Stories, every other export in the story file).
 */
export function CustomDocsPage() {
  return (
    <div className="aaru-docs-page">
      <header className="aaru-docs-page__header">
        <Title />
        <Subtitle />
        <Description />
      </header>

      <section className="aaru-docs-page__section">
        <Primary />
      </section>

      <section className="aaru-docs-page__section">
        <h2 className="aaru-docs-page__heading">Props</h2>
        <Controls />
      </section>

      <section className="aaru-docs-page__section">
        <h2 className="aaru-docs-page__heading">Variants</h2>
        <Stories includePrimary={false} />
      </section>
    </div>
  );
}
