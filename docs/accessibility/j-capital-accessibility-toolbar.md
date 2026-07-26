# J Capital Accessibility Toolbar

## Purpose

The J Capital Accessibility Toolbar is a first-party public-site preference aid. It helps visitors adjust local display and motion preferences while the team continues improving the underlying website accessibility through semantic HTML, keyboard support, readable forms, alt text, focus management, automated checks, and manual review.

The toolbar is not a third-party overlay and does not claim legal compliance.

## Supported Preferences

- Decrease, restore, or increase text size.
- Enable high-contrast display.
- Request reduced motion.
- Underline public-site links.
- Use a readable system font.
- Enhance keyboard focus visibility.
- Reset all saved preferences.

Grayscale, increased line spacing, and increased letter spacing are intentionally omitted from v1 because they can distort layouts if not fully reviewed.

## Architecture

- The toolbar is rendered once from the public application shell.
- Preferences are applied through `html` data attributes and public-site CSS rules.
- Dashboard and admin routes are not modified by the public layout integration.
- The implementation does not call external providers, analytics services, databases, or server routes.

## Storage Policy

- Preferences are stored in browser `localStorage` under `jcapital.accessibility.preferences.v1`.
- No personal information is stored.
- Reset removes stored preferences.
- Accessibility choices are not sent as analytics events.

## Keyboard Behavior

- The floating trigger is a semantic button with an accessible name.
- The trigger exposes expanded and collapsed state with `aria-expanded`.
- Toolbar controls are semantic buttons and use `aria-pressed` where stateful.
- Escape closes the panel and restores focus to the trigger.
- Clicking outside the panel closes it without trapping keyboard focus.

## Figma Design Reference

Figma connection was verified for `hello@jcapitalpropertygroup.com`, but the connected seat was View-only and no approved existing J Capital design file URL/key was available in the repository at implementation time.

CEO visual review should still compare the implemented toolbar against an approved Figma frame when edit access and the existing file are available.

## Testing Coverage

Focused Playwright coverage should verify:

- Open and close behavior.
- Keyboard traversal and Escape behavior.
- Focus restoration.
- Preference activation and persistence.
- Reset confirmation and reset behavior.
- Mobile expanded and collapsed behavior.
- Reduced-motion preference.
- Cookie controls remain usable.

## Limitations

- Preferences are local to the browser and device.
- The toolbar supplements native accessibility work; it does not replace accessible content, forms, headings, labels, focus management, or manual review.
- Users who clear browser storage will clear saved preferences.

## Rollback

Remove the toolbar from the public layout, remove the accessibility toolbar component, and remove the related CSS data-attribute rules. Existing visitors can also clear the localStorage key or use the toolbar reset before rollback.
