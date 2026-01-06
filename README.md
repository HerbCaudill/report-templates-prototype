## Report templates

Report Templates enable users to define reusable document templates that combine static content with dynamic data from various sources. When generating a report, the system merges selected data with the template to produce a final document.

A **report template** consists of:

- **Name**: Display name for the template
- **Description**: Detailed description explaining the template's purpose and usage
- **Group**: Optional grouping for organizing templates in the list view
- **Data sources**: Zero or more data sources to be merged into the template
- **Template file**: The uploaded document template (Word, Excel, or PowerPoint)

**Data sources** define what data will be available when generating a report. |

### Project data sources

- **All projects**: Includes metadata for all projects.
- **Single project**: User selects one project when generating. Includes project metadata, associated data (budget/finance, geography, checklists) and all performance data (data tables, indicator results, targets, and comments).
- **Single project, single reporting period**: User selects both a project and a reporting period when generating. Includes project metadata, reporting period metadata, and all performance data (indicator results, targets, and comments).

### Indicator data sources

- **All indicators**: Includes metadata for all indicators (definitions, disaggregations).
- **Single indicator**: User selects one indicator when generating. Includes indicator metadata and all performance data (indicator results, targets, and comments).

### Data table data sources

Any number of data tables can be added as data sources to a template.

### User input data sources

Any number of user input fields can be added as data sources to a template. This allows templates to collect custom text values at generation time. Each user input data source has:

- **Label**: Display text shown in the generate dialog (e.g., "Report author")
- **Key**: Placeholder key used in the template (auto-generated from label, e.g. "report_author")

### Template data source keys

When a data source is added to a template, it is assigned a customizable **key**. This key is used as a prefix for placeholder tags in the template file.

For example, if a project data source has the key `project`, the template file would use tags like `{{project.name}}`, `{{project.budget}}`, etc.

### Template file

Template files are Word (docx), Excel (xlsx), or PowerPoint (pptx) documents containing placeholder tags (e.g., `{{project.name}}`) that are replaced with actual data when generating reports.

## User interface

### Report templates list

The main view displays all available templates, organized by group.

#### Layout

- Templates are grouped by their `group` field
- Groups can be reordered via drag-and-drop (drag handles appear on hover)
- Default order: "Required reporting" first, then alphabetical, ungrouped templates last
- Each group shows a heading followed by a list of template rows

For each template row:

- **Configure button**: Opens the edit page for the template
- **Document thumbnail**: Visual preview of the template file
- **Template name**: Display name
- **Generate button**: Opens the generate dialog (disabled if no data sources configured)

#### Actions

- **Upload new template** button: Opens file picker to upload a template file, which creates a new template

### Configure template screen

A full-page form for creating or editing templates.

#### Fields

- **Name** (required): Text input for the template name (auto-derived from filename for new templates)
- **Description**: Multi-line text area for detailed description
- **Group**: Dropdown to select existing group or create a new one
  - Options: "No group", existing groups, "+ Add new group..."
  - When creating a new group, a prompt dialog appears
  - Newly created groups display as a tag next to the dropdown
- **Data sources**: Table of selected data sources with:
  - Type column: The data source label
  - Label column: Editable label for user input data sources (blank for other types)
  - Key column: Editable text input for the placeholder key
  - Delete button: Removes the data source
  - "Add datasource..." dropdown: Grouped by category
  - Warning message shown when no data sources are configured
- **Allow certification**: Toggle to enable/disable certification option for this template
- **Template file** (required): Displays the uploaded template with:
  - Word icon and filename
  - **Download** button: Downloads the template file
  - **Replace...** button: Opens file picker to replace the template

#### New template flow

1. User clicks "Upload new template" from the list view and picks a file
   OR
   User drags a document onto the screen
2. Edit page opens with template created, name derived from filename
3. User configures remaining fields

#### Validation

- Name must not be empty
- A template file must be uploaded
- Data sources are required; the "Generate" button will be disabled on templates without them

#### Save behavior

- **Editing existing template:** Auto-saves on every change
- **Creating new template:** Created immediately when file is uploaded

### Generate report dialog

A modal dialog for generating a report from a template.

#### Dynamic fields

Shown based on template data sources:

- **Project dropdown**: Shown if template uses a single project data source
- **Reporting period dropdown**: Shown if template requires a reporting period
- **Indicator dropdown**: Shown if template uses a single indicator data source
- **User input fields**: Text inputs for each user input data source (labeled with the custom label)

#### Static fields

- **Output format toggle**: PDF or Word (default: PDF)
- **Save to documents switch**: Option to save to system document library
- **Certify switch**: Option to digitally certify the report (only shown if template allows certification)

#### Certification flow

1. User enables "Certify" switch (disabled until required fields are filled)
2. Certification panel appears with statement: "I, [User Name], certify this report."
3. Generate button is temporarily disabled
4. User clicks "Certify" button
5. Seal icon with "Certified" text replaces the button
6. Generate button is re-enabled

#### Validation

- All required dropdowns must have a selection
- All user input fields must be filled
- If "Certify" is enabled, certification must be completed
- Generate button is disabled until valid

#### Actions

- **Generate** button: Generates the report and closes dialog
- Click outside dialog: Closes without generating
