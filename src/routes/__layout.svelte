<script>
  import '../app.postcss';
  import { base } from '$app/paths';
</script>

<div
  class="h-full min-h-screen pb-10 bg-gray-50 dark:bg-blue-deep text-gray-800 dark:text-gray-300"
>
  <nav class="h-16 flex items-center justify-end mr-5 sm:mb-16">
    <ul class="flex space-x-5">
      <li><a href="{base}/">Trang chủ</a></li>
      <li
        class="after:content-['new'] after:text-xs after:bg-blue after:text-white after:px-1 after:rounded-sm after:relative after:bottom-2 after:left-0.5"
      >
        <a href="{base}/useful-tips">Mẹo hữu ích</a>
      </li>
      <li>
        <a href="https://www.facebook.com/dykhng/">
          <!-- prettier-ignore -->
          <svg class="w-5 h-5 text-gray-700" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">
            <circle fill="currentColor" cx="15" cy="15" r="15"/>
            <path fill="#FFFFFF" d="M16.4,23.9v-8.1h2.7l0.4-3.2h-3.1v-2c0-0.9,0.3-1.5,1.6-1.5l1.7,0V6.2c-0.3,0-1.3-0.1-2.4-0.1  c-2.4,0-4.1,1.5-4.1,4.2v2.3h-2.7v3.2h2.7v8.1H16.4z"/>
          </svg>
        </a>
      </li>
      <li>
        <a href="https://github.com/iceghost/bkalendar">
          <!-- prettier-ignore -->
          <svg class="w-5 h-5 text-gray-700" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)"/>
          </svg>
        </a>
      </li>
    </ul>
  </nav>
  <slot />
</div>

<style>
  li,
  svg {
    @apply hover:text-blue;
  }
</style>
