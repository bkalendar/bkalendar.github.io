<script lang="ts">
	import type { MachineTimetable } from '@bkalendar/core';

	export let semester: MachineTimetable['semester'];
</script>

<span>Học kỳ {semester.year % 100}{semester.semester}</span>
