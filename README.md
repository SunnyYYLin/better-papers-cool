# better-papers-cool

A Tampermonkey userscript that enhances the browsing experience on arXiv.org and papers.cool with cross-links, BibTeX export, and advanced date filtering capabilities.

## Features

### 🔗 Cross-Platform Navigation
- **On arXiv.org**: Adds a direct link to the corresponding papers.cool page
- **On papers.cool**: Adds direct links back to arXiv and BibTeX export functionality

### 📋 One-Click BibTeX Export
- Click the `[BibTex]` button to automatically fetch and copy the BibTeX citation to your clipboard
- No need to visit arXiv separately for citations

### 📅 Advanced Date Filtering
- Filter papers by publication date range
- Visual date picker interface with "From" and "To" date inputs
- Real-time filtering with instant visual feedback
- Shows count of visible vs. filtered papers

### 🔄 Smart Auto-Pagination
- Automatically loads more pages when filtered results are too few (< 5 papers per page)
- Works seamlessly with auto-pagination browser extensions
- Configurable auto-load behavior with user toggle
- Prevents infinite loops with maximum attempt limits (10 pages)
- New papers from pagination are automatically filtered

### 🎯 Persistent Filtering
- Filter settings persist across dynamically loaded content
- Uses MutationObserver to detect and filter newly added papers
- Works with infinite scroll and pagination plugins

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click on the Tampermonkey icon and select "Create a new script"
3. Copy the contents of `betterPapersCool.js` into the editor
4. Save the script (Ctrl+S or Cmd+S)

## Usage

### On arXiv.org
- Navigate to any paper page (e.g., `https://arxiv.org/abs/2401.12345`)
- Look for the new "Papers Cool" link in the sidebar
- Click to view the paper on papers.cool

### On papers.cool
- Navigate to any papers.cool page (e.g., search results or categories)
- Each paper will have `[arXiv]` and `[BibTex]` buttons added
- Use the date filter panel that appears above the paper list

### Date Filtering
1. **Set Date Range**: Use the date pickers to set "From" and "To" dates
2. **Apply Filter**: Click "Apply Filter" to filter papers
3. **View Results**: See the count of visible papers and filtered-out papers
4. **Auto-Load**: Toggle "Auto-load more pages" if you want the script to automatically fetch more pages when results are sparse
5. **Reset**: Click "Reset" to clear filters and show all papers

### Auto-Load Configuration
- **Enabled by default** when a date filter is applied
- **Minimum papers per page**: 5 (if fewer visible, triggers auto-load)
- **Maximum attempts**: 10 consecutive page loads
- **User control**: Uncheck the toggle to disable auto-loading

## Configuration

You can customize the auto-load behavior by modifying these values in the script:

```javascript
const autoLoadConfig = {
    minPapersPerPage: 5,  // Minimum papers before triggering auto-load
    maxAutoLoadAttempts: 10,  // Maximum consecutive auto-loads
};
```

## How It Works

1. **Link Enhancement**: The script detects the current page and adds appropriate cross-links
2. **BibTeX Fetching**: Uses `GM_xmlhttpRequest` to fetch BibTeX data from arXiv's API
3. **Date Extraction**: Parses `<span class="date-data">` elements to extract publication dates
4. **Smart Filtering**: 
   - Applies filter to existing papers immediately
   - Monitors DOM for new papers using MutationObserver
   - Automatically filters new papers as they're added
5. **Auto-Pagination**:
   - Checks visible paper count after filtering
   - Triggers next page load via scroll events or button clicks
   - Repeats until minimum paper threshold is met or max attempts reached

## Compatibility

- ✅ Works with Tampermonkey on Chrome, Firefox, Edge, Safari
- ✅ Compatible with auto-pagination extensions (e.g., AutoPagerize, Pagetual)
- ✅ Supports infinite scroll implementations
- ✅ Responsive design adapts to different screen sizes

## Troubleshooting

**BibTeX not copying?**
- Ensure clipboard permissions are granted to the browser
- Try clicking the button again

**Auto-load not working?**
- Check if the auto-load toggle is enabled
- Verify your pagination plugin is active
- Check browser console for any error messages

**Filter not applying to new papers?**
- The script uses MutationObserver which should detect all DOM changes
- If issues persist, try refreshing the page with the filter active

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Author

SunnyYYLin

## Version History

### v0.2 (Latest)
- ✨ Added advanced date filtering with visual UI
- 🔄 Smart auto-pagination for filtered results  
- 🎯 Persistent filtering across dynamic content
- 📊 Real-time statistics display
- ⚙️ User-configurable auto-load behavior

### v0.1
- 🔗 Cross-links between arXiv and papers.cool
- 📋 One-click BibTeX export
