# Report templates feature specification

This document describes the Report Templates feature, which allows users to create, manage, and generate reports from customizable templates.

## Overview

Report Templates enable users to define reusable document templates that combine static content with dynamic data from various sources. When generating a report, the system merges selected data with the template to produce a final document.

## Core concepts

### Report template

A report template consists of:

- **Name** - Display name for the template
- **Description** - Detailed description explaining the template's purpose and usage
- **Group** - Optional grouping for organizing templates in the list view
- **Data sources** - Zero or more data sources to be merged into the template
- **Template file** - The uploaded document template (Word, Excel, or PowerPoint)

### Data sources

Data sources define what data will be available when generating a report. Each data source is categorized and may require user selection at generation time.

#### Categories

| Category          | Description                  | Selection Behavior                                        |
| ----------------- | ---------------------------- | --------------------------------------------------------- |
| **Projects**      | Project-related data         | Single selection only (one project source per template)   |
| **Indicators**    | Performance indicators       | Single selection only (one indicator source per template) |
| **Data tables**   | Custom data tables           | Multiple allowed                                          |
| **Saved reports** | Previously saved report data | Multiple allowed                                          |

#### Project data sources

- **All projects** - Includes data for all projects; no user selection required
- **Single project** - User selects one project when generating
- **Single project, single reporting period** - User selects both a project and a reporting period when generating

#### Indicator data sources

- **All indicators** - Includes data for all indicators; no user selection required
- **Single indicator** - User selects one indicator when generating

### Template data source keys

When a data source is added to a template, it is assigned a customizable **key**. This key is used as a prefix for placeholder tags in the template file.

For example, if a project data source has the key `project`, the template file would use tags like `{{project.name}}`, `{{project.budget}}`, etc.

### Template file

Template files are Word (.docx), Excel (.xlsx), or PowerPoint (.pptx) documents containing placeholder tags (e.g., `{{project.name}}`) that are replaced with actual data when generating reports.

## User interface

### 1. Report templates list

The main view displays all available templates, organized by group.

#### Layout

- Templates are grouped by their `group` field
- Groups are displayed in alphabetical order, with ungrouped templates shown first (without a heading)
- Each group shows a heading followed by a list of template rows

#### For each template row

- **Edit button** - Opens the edit page for the template
- **Document icon** - Visual indicator of document type (Word/Excel/Powerpoint)
- **Template name** - Display name
- **Generate button** - Opens the generate dialog (disabled if no data sources configured)

#### Actions

- **Upload new template** button - Opens file picker to upload a template file, which creates a new template

### 2. Edit template page

A full-page form for creating or editing templates.

#### Fields

- **Name** (required) - Text input for the template name (auto-derived from filename for new templates)
- **Description** - Multi-line text area for detailed description
- **Group** - Dropdown to select existing group or create a new one
  - Options: "No group", existing groups, "+ Add new group..."
  - When creating a new group, a prompt dialog appears
  - Newly created groups display as a tag next to the dropdown
- **Data sources** - Table of selected data sources with:
  - Type column - The data source label
  - Key column - Editable text input for the placeholder key
  - Delete button - Removes the data source
  - "Add datasource..." dropdown - Grouped by category
  - Warning message shown when no data sources are configured
- **Template file** (required) - Displays the uploaded template with:
  - Word icon and filename
  - **Download** button - Downloads the template file
  - **Replace...** button - Opens file picker to replace the template

#### New template flow

1. User clicks "Upload new template" from the list view
2. File picker opens to select a template file
3. Edit page opens with template created, name derived from filename
4. User configures remaining fields

#### Validation

- Name must not be empty
- A template file must be uploaded
- Data sources are optional (but Generate button will be disabled on templates without them)

#### Save behavior

- **Editing existing template:** Auto-saves on every change
- **Creating new template:** Created immediately when file is uploaded

#### Actions

- **Done** button (with checkmark icon) - Returns to list
- **Delete this report template** link - Only shown for existing templates; deletes and returns to list

#### Browser navigation

Back button returns to list

### 3. Generate report dialog

A modal dialog for generating a report from a template.

#### Dynamic fields

Shown based on template data sources:

- **Project dropdown** - Shown if template uses a single project data source
- **Reporting period dropdown** - Shown if template requires a reporting period
- **Indicator dropdown** - Shown if template uses a single indicator data source

#### Static fields

- **Output format toggle** - PDF or Word (default: PDF)
- **Save to documents checkbox** - Option to save to system document library
- **Certify checkbox** - Option to digitally certify the report

#### Certification flow

1. User checks "Certify" checkbox (disabled until required fields are filled)
2. Certification panel appears with statement: "I, [User Name], certify this report."
3. User clicks "Certify" button
4. Seal icon with "Certified" text replaces the button
5. Generate button becomes enabled

#### Validation

- All required dropdowns must have a selection
- If "Certify" is checked, certification must be completed
- Generate button is disabled until valid

#### Actions

- **Generate** button - Generates the report and closes dialog
- Click outside dialog - Closes without generating

## Information tooltips

Contextual help is provided via info icons (ⓘ) that show tooltips on hover:

| Location                   | Tooltip Text                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Data sources "Key" column  | "This key must match the placeholder tags in your template file."                                                                               |
| Template upload            | "Upload a Word, Excel, or PowerPoint file with placeholder tags like {{project.name}} that will be replaced with data when generating reports." |
| Save to documents checkbox | "In addition to downloading the report, it will be saved in the system document library in the "[Template Name]" folder."                       |
| Certify checkbox           | "Certifying a report attaches your digital signature to the report, confirming the data is accurate and approved for distribution."             |
