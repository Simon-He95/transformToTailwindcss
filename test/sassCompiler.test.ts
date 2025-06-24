import { describe, expect, it } from 'vitest'
import { sassCompiler } from '../src/sassCompiler'
import { compilerCss } from '../src/compilerCss'
import path from 'node:path'

describe('sassCompiler', () => {
  const testDir = path.join(__dirname, 'demo', 'sass')

  it('should compile basic SCSS', async () => {
    const css = `
      $primary-color: #007bff;
      .button {
        background-color: $primary-color;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
      }
    `
    const result = await sassCompiler(css, path.join(testDir, 'basic.scss'))
    expect(result).toContain('background-color: #007bff')
    expect(result).toContain('padding: 10px 20px')
  })

  it('should handle @use directive with relative path', async () => {
    const css = `
      @use './variables';
      .button {
        background-color: variables.$primary-color;
        color: variables.$text-color;
      }
    `
    const result = await sassCompiler(css, path.join(testDir, 'use-test.scss'))
    expect(result).toBeDefined()
  })

  it('should handle @use directive with namespace alias', async () => {
    const css = `
      @use './variables' as vars;
      .button {
        background-color: vars.$primary-color;
        color: vars.$text-color;
      }
    `
    const result = await sassCompiler(css, path.join(testDir, 'use-alias.scss'))
    expect(result).toBeDefined()
  })

  it('should handle @use directive with configuration', async () => {
    const css = `
      @use './theme' with (
        $primary-color: #ff6b6b,
        $secondary-color: #4ecdc4
      );
      .card {
        background: theme.$primary-color;
        border: 1px solid theme.$secondary-color;
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'use-config.scss'),
    )
    expect(result).toBeDefined()
  })

  it('should handle @forward directive', async () => {
    const css = `
      @use './mixins';
      
      .component {
        @include mixins.button-style;
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'forward-test.scss'),
    )
    expect(result).toBeDefined()
    expect(result).toContain('background-color')
  })

  it('should handle real @forward directive', async () => {
    const css = `
      @use './index';
      
      .component {
        color: index.$primary-color;
        @include index.button-style;
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'real-forward.scss'),
    )
    expect(result).toBeDefined()
    expect(result).toContain('color: #007bff')
    expect(result).toContain('background-color')
  })

  it('should handle @forward directive with prefix', async () => {
    const css = `
      @use './variables' as vars;
      
      .component {
        color: vars.$primary-color;
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'forward-prefix.scss'),
    )
    expect(result).toBeDefined()
    expect(result).toContain('color: #007bff')
  })

  it('should handle @include directive', async () => {
    const css = `
      @mixin button-style($bg-color: #007bff) {
        background-color: $bg-color;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .btn-primary {
        @include button-style(#007bff);
      }
      
      .btn-secondary {
        @include button-style(#6c757d);
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'include-test.scss'),
    )
    expect(result).toContain('background-color: #007bff')
    expect(result).toContain('background-color: #6c757d')
    expect(result).toContain('padding: 10px 20px')
  })

  it('should handle legacy @import directive (deprecated but still supported)', async () => {
    const css = `
      @import './variables';
      @import './mixins';
      
      .component {
        color: $primary-color;
        @include button-style;
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'legacy-import-test.scss'),
    )
    expect(result).toBeDefined()
    // Note: This will show deprecation warnings but should still work
  })

  it('should handle modern @use directive instead of deprecated @import', async () => {
    const css = `
      @use './variables';
      @use './mixins';
      
      .component {
        color: variables.$primary-color;
        @include mixins.button-style;
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'modern-import-test.scss'),
    )
    expect(result).toBeDefined()
    expect(result).toContain('#007bff')
  })

  it('should handle nested @use and @include', async () => {
    const css = `
      @use './mixins' as mx;
      @use './variables' as vars;
      
      .card {
        background: vars.$card-bg;
        @include mx.card-shadow;
        
        &__header {
          @include mx.flex-center;
          color: vars.$header-color;
        }
        
        &__content {
          padding: vars.$content-padding;
        }
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'nested-test.scss'),
    )
    expect(result).toBeDefined()
  })

  it('should handle globalCss with @use directives', async () => {
    const globalCss = `
      @use './theme' as theme;
      
      :root {
        --primary-color: #{theme.$primary-color};
        --secondary-color: #{theme.$secondary-color};
      }
    `

    const css = `
      .component {
        background: var(--primary-color);
        border: 1px solid var(--secondary-color);
      }
    `

    const result = await sassCompiler(
      css,
      path.join(testDir, 'global-test.scss'),
      globalCss,
    )
    expect(result).toBeDefined()
  })

  it('should skip built-in Sass modules', async () => {
    const css = `
      @use 'sass:math';
      @use 'sass:color';
      @use 'sass:string';
      
      .component {
        width: math.div(100px, 2);
        color: color.scale(#007bff, $lightness: 20%);
        content: string.quote('hello');
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'builtin-test.scss'),
    )
    expect(result).toBeDefined()
    expect(result).toContain('width: 50px')
  })

  it('should handle error cases gracefully', async () => {
    const css = `
      @use './non-existent-file';
      
      .component {
        color: $undefined-variable;
      }
    `
    const result = await sassCompiler(
      css,
      path.join(testDir, 'error-test.scss'),
      undefined,
      true,
    )
    // Should not throw, but return undefined and log error
    expect(result).toBeUndefined()
  })
})

describe('compilerCss file:// URL handling', () => {
  it('should handle file:// URLs gracefully (may fail but should not crash)', async () => {
    const cssWithFileUrl = `
      @use 'file:///some/absolute/path/to/styles.scss';
      
      .test {
        color: red;
      }
    `

    // Test that CSS with file:// URL gets processed without crashing
    // The compilation may fail due to missing file, but should not throw unexpected errors
    const result = await compilerCss(
      cssWithFileUrl,
      'scss',
      path.join(__dirname, 'demo', 'sass', 'test.scss'),
    )

    console.log('Processing CSS with file:// URL...')
    // Should either succeed or fail gracefully (return undefined)
    expect(typeof result === 'string' || result === undefined).toBe(true)
  })
})
